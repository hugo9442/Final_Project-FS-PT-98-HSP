from flask import current_app
from flask_jwt_extended import create_access_token
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from decimal import Decimal
import os
import uuid
import logging
from flask_bcrypt import Bcrypt
from api.models import (
    db, User, Contract, Apartment, AssocTenantApartmentContract,
    TaxType, Withholding, Docusing 
)
from api.models.users import Role
from api.routes.contract_routes import get_r2_client
from api.extensions import mail
from .email_tenant import send_tenant_invitation_email, send_owner_notification_email


bcrypt = Bcrypt()
# --- Función para crear tenant (sin envío de mail) ---
def create_tenant(data):
    email_lower = data.get("email", "").strip().lower()
    if not email_lower or '@' not in email_lower:
        raise ValueError("Email inválido o ausente")

    # Buscar usuario en base de datos (committeada)
    existing_user = User.query.filter_by(email=email_lower).first()

    # Buscar también en la sesión actual (nuevos objetos no committeados)
    if not existing_user:
        for obj in db.session.new:
            if isinstance(obj, User) and obj.email == email_lower:
                existing_user = obj
                break

    if existing_user:
        raise ValueError("Ya existe un usuario con este email")

    temporary_password = str(uuid.uuid4())
    hashed_temporary_password = bcrypt.generate_password_hash(
        temporary_password).decode('utf-8')

    new_tenant = User(
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        email=email_lower,
        password=hashed_temporary_password,
        phone=data.get("phone"),
        national_id=data.get("national_id"),
        account_number=data.get("account_number"),
        role=Role.INQUILINO
    )
    db.session.add(new_tenant)
    db.session.flush()  # Obtener ID sin commitear todavía
    return new_tenant


# --- Función para crear contrato ---
def create_contract(form, file_storage):
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

    if not file_storage:
        raise ValueError("No se proporcionó archivo")

    if file_storage.filename == '':
        raise ValueError("Archivo sin nombre")

    if not allowed_file(file_storage.filename):
        raise ValueError("Solo archivos PDF permitidos")

    original_name = secure_filename(file_storage.filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{original_name.rsplit('.', 1)[0]}_{timestamp}.pdf"

    file_storage.seek(0, os.SEEK_END)
    file_size = file_storage.tell()
    file_storage.seek(0)

    if file_size == 0:
        raise ValueError("El archivo está vacío")

    s3 = get_r2_client()
    s3.upload_fileobj(
        file_storage,
        os.getenv("R2_BUCKET_NAME"),
        unique_filename,
        ExtraArgs={
            'ContentType': 'application/pdf',
            'ACL': 'private'
        }
    )

    file_url = f"{os.getenv('R2_PUBLIC_URL')}/{unique_filename}"

    new_contract = Contract(
        start_date=datetime.fromisoformat(form['start_date']),
        end_date=datetime.fromisoformat(form['end_date']),
        owner_id=form['owner_id'],
        document=file_url
    )
    db.session.add(new_contract)
    db.session.flush()  # Para obtener id
    return new_contract


# --- Función para crear asociación ---
def create_association(data):
    required_fields = ["tenant_id", "apartment_id", "contract_id", "renta", "tax_type_id", "withholding_id"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        raise ValueError(f"Faltan campos: {', '.join(missing)}")

    tenant_id = data["tenant_id"]
    contract_id = data["contract_id"]
    apartment_id = data["apartment_id"] 
    renta = Decimal(data["renta"])
    tax_type_id = data["tax_type_id"]
    withholding_id = data["withholding_id"]

    tax_type = TaxType.query.get(tax_type_id)
    if not tax_type:
        raise ValueError("TaxType no encontrado")

    withholding = Withholding.query.get(withholding_id)
    if not withholding:
        raise ValueError("Withholding no encontrado")

    association = AssocTenantApartmentContract(
        tenant_id=tenant_id,
        contract_id=contract_id,
        apartment_id=apartment_id,
        renta=renta,
        tax_type_id=tax_type_id,
        withholding_id=withholding_id,
        tax_percentage_applied=tax_type.percentage,
        withholding_percentage_applied=withholding.percentage,
        is_active=True
    )
    db.session.add(association)
    db.session.flush()
    return association


# --- Función para actualizar apartment ---
def mark_apartment_as_rented(apartment_id):
    apartment = Apartment.query.get(apartment_id)
    if not apartment:
        raise ValueError("Apartment no encontrado")

    apartment.is_rent = True
    db.session.flush()
    return apartment


# --- Función que orquesta todo ---


def create_full_tenancy_flow(envelope_id, contract_file):
    """
    Flujo completo para procesar un DocuSign.
    Todo en una transacción: si hay error, rollback total.
    Crea tenant, contrato, asociación y marca apartamento como alquilado.
    Emails se envían solo si todo va bien.
    """
    from sqlalchemy.exc import SQLAlchemyError

    try:
        # Inicia la transacción
        with db.session.begin_nested():
            docu_data = Docusing.query.filter_by(envelope_id=envelope_id).first()
            if not docu_data:
                raise ValueError("No se encontró registro Docusing para este envelope")

            # Datos del tenant
            tenant_data = {
                "first_name": docu_data.tenant_name.split(' ')[0] if docu_data.tenant_name else "",
                "last_name": ' '.join(docu_data.tenant_name.split(' ')[1:]) if docu_data.tenant_name else "",
                "email": docu_data.tenant_email,
                "phone": docu_data.tenant_phone,
                "national_id": docu_data.tenant_dni,
                "account_number": docu_data.account_number
            }

            # Crear tenant si no existe (buscando por national_id)
            existing_tenant = User.query.filter_by(national_id=tenant_data["national_id"]).first()
            if existing_tenant:
                new_tenant = existing_tenant
            else:
                new_tenant = create_tenant(tenant_data)

            # Crear contrato
            contract_form = {
                "start_date": docu_data.start_date.isoformat() if docu_data.start_date else None,
                "end_date": docu_data.end_date.isoformat() if docu_data.end_date else None,
                "owner_id": docu_data.owner_id
            }
            new_contract = create_contract(contract_form, contract_file)

            # Crear asociación
            association_data = {
                "renta": docu_data.rent_amount if hasattr(docu_data, "rent_amount") else None,
                "tax_type_id": docu_data.iva_id,
                "withholding_id": docu_data.retencion_id,
                "apartment_id": docu_data.apartment_id,
                "tenant_id": new_tenant.id,
                "contract_id": new_contract.id
            }
            new_association = create_association(association_data)

            # Marcar apartamento como alquilado
            mark_apartment_as_rented(docu_data.apartment_id)

        # Commit de toda la transacción si todo va bien
        db.session.commit()

        # Enviar emails solo si commit exitoso
        send_tenant_invitation_email(new_tenant.id)
        send_owner_notification_email(
            owner_id=docu_data.owner_id,
            tenant_name=f"{new_tenant.first_name} {new_tenant.last_name}",
            apartment_id=docu_data.apartment_id
        )

        return {
            "msg": "Flujo completo creado con éxito",
            "tenant_id": new_tenant.id,
            "contract_id": new_contract.id,
            "association_id": new_association.id,
        }

    except (ValueError, SQLAlchemyError, Exception) as e:
        db.session.rollback()
        logging.error(f"Error en create_full_tenancy_flow: {e}", exc_info=True)
        return {"msg": f"Error procesando DocuSign: {str(e)}"}

