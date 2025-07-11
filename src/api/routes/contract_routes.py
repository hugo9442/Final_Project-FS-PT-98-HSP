from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file
from api.models import db, Contract, AssocTenantApartmentContract, Apartment
from api.models.users import Role
from sqlalchemy.orm import joinedload
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import boto3
from botocore.client import Config
from io import BytesIO
from botocore.exceptions import ClientError

contracts_api = Blueprint('contracts_api', __name__, url_prefix='/contracts')

CORS(contracts_api)

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=os.getenv("R2_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"), 
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )

@contracts_api.route('/', methods=["GET"])
@jwt_required()
def get_all_contracts():
    contracts = Contract.query.all()
    return jsonify([contract.serialize() for contract in contracts]), 200

@contracts_api.route('/<int:contract_id>', methods=["GET"])
@jwt_required()
def get_contract(contract_id):
    contract = Contract.query.get(contract_id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404
    return jsonify(contract.serialize()), 200

@contracts_api.route('/<int:contract_id>', methods=["PUT"])
@jwt_required()
def update_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data_request = request.get_json()

    contract.start_date = data_request.get("start_date", contract.start_date)
    contract.end_date = data_request.get("end_date", contract.end_date)
    contract.owner_id = data_request.get("owner_id", contract.owner_id)

    try:
        db.session.commit()
        return jsonify({"msg": "Contract updated", "contract": contract.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500



@contracts_api.route('/download/<contract_id>', methods=['GET'])
@jwt_required()
def download_contract(contract_id):
    try:
      
        contract = Contract.query.get_or_404(contract_id)
        
        filename = contract.document.split('/')[-1]
        
        s3 = get_r2_client()
        
        file_stream = BytesIO()
        s3.download_fileobj(
            os.getenv("R2_BUCKET_NAME"),
            filename,
            file_stream
        )
        file_stream.seek(0) 
        
        
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return jsonify({"error": "Archivo no encontrado en R2"}), 404
        return jsonify({"error": f"Error de AWS: {str(e)}"}), 500
        
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

@contracts_api.route('/create', methods=['POST'])
@jwt_required()
def create_contract():
    # Debug 1: Verificar llegada de datos
  
    
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf'}

    # Debug 2: Verificación de archivo
    if 'document' not in request.files:
        
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['document']
   
    
    if file.filename == '':
       
        return jsonify({"error": "No selected file"}), 400
        
    if not (file and allowed_file(file.filename)):
       
        return jsonify({"error": "Solo se permiten archivos PDF"}), 400

    # Generación de nombre único
    original_name = secure_filename(file.filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{original_name.rsplit('.', 1)[0]}_{timestamp}.pdf"
    print("Nombre único generado:", unique_filename)
    
    try:

        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
    
        
        if file_size == 0:
            raise ValueError("El archivo está vacío")

        
        s3 = get_r2_client()
        s3.upload_fileobj(
            file,
            os.getenv("R2_BUCKET_NAME"),
            unique_filename,
            ExtraArgs={
                'ContentType': 'application/pdf',
                'ACL': 'private'  # Cambiar a 'public-read' si necesitas acceso público
            }
        )

    
        file_url = f"{os.getenv('R2_PUBLIC_URL')}/{unique_filename}"
                
        new_contract = Contract(
            start_date=datetime.fromisoformat(request.form['start_date']),
            end_date=datetime.fromisoformat(request.form['end_date']),
            owner_id=request.form['owner_id'],
            document=file_url
        )
        
        db.session.add(new_contract)
        db.session.commit()
    

        return jsonify({
            "msg": "El contrato ha sido registrado satisfactoriamente",
            "file_url": file_url,
            "contract": new_contract.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        error_msg = f"ERROR DETALLADO: {str(e)}"
        print(error_msg)
        current_app.logger.error(error_msg)
        
        # Manejo específico de errores de AWS
        if hasattr(e, 'response'):
            print("Respuesta de error de AWS:", e.response)
            
        return jsonify({
            "error": "Error al procesar el archivo",
            "details": str(e)
        }), 500


@contracts_api.route('/<int:contract_id>', methods=["DELETE"])
@jwt_required()
def delete_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    try:
        db.session.delete(contract)
        db.session.commit()
        return jsonify({"msg": "Contract deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500

@contracts_api.route('/by_apartment/<int:apartment_id>', methods=["GET"])
@jwt_required()
def get_contracts_by_apartment(apartment_id):
    # Buscar asociaciones con joinedload para acceder a tenant, apartment, contract y contract.owner
    asociaciones = AssocTenantApartmentContract.query.options(
        joinedload(AssocTenantApartmentContract.contract).joinedload(Contract.owner),
        joinedload(AssocTenantApartmentContract.tenant),
        joinedload(AssocTenantApartmentContract.apartment)
    ).filter_by(apartment_id=apartment_id).all()

    if not asociaciones:
        return jsonify({"error": "No hay asociaciones para este apartamento"}), 404

    contratos_dict = {}

    for assoc in asociaciones:
        contrato = assoc.contract
        contrato_id = contrato.id

        # Si aún no hemos agregado este contrato, lo inicializamos
        if contrato_id not in contratos_dict:
            contratos_dict[contrato_id] = contrato.serialize()
            contratos_dict[contrato_id]["owner"] = contrato.owner.serialize() if contrato.owner else None
            contratos_dict[contrato_id]["asociaciones"] = []

        # Agregamos cada asociación válida (con inquilino)
        if assoc.tenant and assoc.tenant.role == Role.INQUILINO:
            contratos_dict[contrato_id]["asociaciones"].append({
                "assoc_id": assoc.id,
                "tenant": assoc.tenant.serialize(),
                "apartment": assoc.apartment.serialize() if assoc.apartment else None,
                "contract": contrato.serialize()
            })

    return jsonify(list(contratos_dict.values())), 200

@contracts_api.route('/<int:tenant_id>/contracts/assoc/tenant', methods=["GET"])
@jwt_required()
def get_contracts_by_tenant(tenant_id):


    associations = AssocTenantApartmentContract.query.options(
        joinedload(AssocTenantApartmentContract.contract)
            .joinedload(Contract.association)
            .joinedload(AssocTenantApartmentContract.tenant),
        joinedload(AssocTenantApartmentContract.apartment)
    .joinedload(Apartment.issues),  # <-- para evitar consultas N+1
        joinedload(AssocTenantApartmentContract.tenant)
    ).filter_by(tenant_id=tenant_id).all()

    if not associations:
        return jsonify({"error": "No se encontraron asociaciones para este inquilino"}), 404

    contratos_dict = {}

    for assoc in associations:
        contract = assoc.contract
        contract_id = contract.id

        if contract_id not in contratos_dict:
            contratos_dict[contract_id] = contract.serialize()
            contratos_dict[contract_id]["asociaciones"] = []

        if assoc.tenant and assoc.tenant.role == Role.INQUILINO:
            contratos_dict[contract_id]["asociaciones"].append({
                "assoc_id": assoc.id,
                "is_active": assoc.is_active,
                "renta":assoc.renta,
                "tenant": assoc.tenant.serialize(),
                "apartment": {
                    **assoc.apartment.serialize(),
                    "issues": [issue.serialize() for issue in assoc.apartment.issues]
                } if assoc.apartment else None
            })

    return jsonify(list(contratos_dict.values())), 200
