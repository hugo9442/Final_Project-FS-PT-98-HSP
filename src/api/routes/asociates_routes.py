from flask import request, jsonify, Blueprint
from api.models import db, AssocTenantApartmentContract,Apartment,TaxType, Withholding
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from decimal import Decimal

asociates_api = Blueprint('asociates_api', __name__, url_prefix='/asociates')

CORS(asociates_api)



@asociates_api.route('/', methods=['GET'])
@jwt_required()
def get_asociations():
    try:
        asociaciones = AssocTenantApartmentContract.query.all()
        return jsonify([a.serialize() for a in asociaciones]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@asociates_api.route('/full', methods=['GET'])
@jwt_required()
def get_full_asociations():
    try:
        asociaciones = AssocTenantApartmentContract.query.all()
        return jsonify([a.serialize() for a in asociaciones]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@asociates_api.route('/no-apartment', methods=['GET'])
@jwt_required()
def get_associations_without_apartment():
    try:
        asociaciones = AssocTenantApartmentContract.query.filter(
            AssocTenantApartmentContract.apartment_id == None, AssocTenantApartmentContract.is_active == True
        ).all()
        return jsonify([a.serialize() for a in asociaciones]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@asociates_api.route('/create', methods=['POST'])
@jwt_required()
def create_association():
    try:
        data = request.get_json()

        required_fields = ["tenant_id", "contract_id", "renta", "tax_type_id", "withholding_id"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Faltan campos: {', '.join(missing)}"}), 400

        tenant_id = data["tenant_id"]
        contract_id = data["contract_id"]
        renta = Decimal(data["renta"])
        tax_type_id = data["tax_type_id"]
        withholding_id = data["withholding_id"]

        tax_type = TaxType.query.get(tax_type_id)
        if not tax_type:
            return jsonify({"error": "TaxType no encontrado"}), 404

        withholding = Withholding.query.get(withholding_id)
        if not withholding:
            return jsonify({"error": "Withholding no encontrado"}), 404

        association = AssocTenantApartmentContract(
            tenant_id=tenant_id,
            contract_id=contract_id,
            renta=renta,
            tax_type_id=tax_type_id,
            withholding_id=withholding_id,
            tax_percentage_applied=tax_type.percentage,
            withholding_percentage_applied=withholding.percentage,
            is_active=True
        )

        db.session.add(association)
        db.session.commit()

        return jsonify({"message": "Asociación creada exitosamente", "association": association.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@asociates_api.route('/update-association-apartment/<int:assoc_id>/<int:apartment_id>', methods=['PUT'])
@jwt_required()
def update_association_and_apartment(assoc_id, apartment_id):
    assoc_body = request.get_json().get("association")
    apartment_body = request.get_json().get("apartment")

    if not assoc_body or not apartment_body:
        return jsonify({"msg": "Faltan datos para actualizar"}), 400

    try:
        # INICIO TRANSACCIÓN
        asociacion = AssocTenantApartmentContract.query.get(assoc_id)
        apartamento = Apartment.query.get(apartment_id)

        if not asociacion:
            return jsonify({"msg": "Asociación no encontrada"}), 404
        if not apartamento:
            return jsonify({"msg": "Apartamento no encontrado"}), 404

        # CAMPOS PROTEGIDOS
        assoc_protected = ["id", "tenant_id", "contract_id"]
        apt_protected = ["id", "owner_id"]

        for key, value in assoc_body.items():
            if key not in assoc_protected and hasattr(asociacion, key):
                setattr(asociacion, key, value)

        for key, value in apartment_body.items():
            if key not in apt_protected and hasattr(apartamento, key):
                setattr(apartamento, key, value)

        db.session.commit()

        return jsonify({
            "msg": "Asociación y apartamento actualizados correctamente",
            "association": asociacion.serialize(),
            "apartment": apartamento.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error durante la actualización", "error": str(e)}), 500
    
    
@asociates_api.route('/delete-association-apartment/<int:assoc_id>/<int:apartment_id>', methods=['PUT'])
@jwt_required()
def delete_association_and_apartment(assoc_id, apartment_id):
    assoc_body = request.get_json().get("association")
    apartment_body = request.get_json().get("apartment")

    if not assoc_body or not apartment_body:
        return jsonify({"msg": "Faltan datos para actualizar"}), 400

    try:
        # INICIO TRANSACCIÓN
        asociacion = AssocTenantApartmentContract.query.get(assoc_id)
        apartamento = Apartment.query.get(apartment_id)

        if not asociacion:
            return jsonify({"error": "Asociación no encontrada"}), 404
        if not apartamento:
            return jsonify({"error": "Apartamento no encontrado"}), 404

        # CAMPOS PROTEGIDOS
        assoc_protected = ["id", "tenant_id", "contract_id"]
        apt_protected = ["id", "owner_id"]

        for key, value in assoc_body.items():
            if key not in assoc_protected and hasattr(asociacion, key):
                setattr(asociacion, key, value)

        for key, value in apartment_body.items():
            if key not in apt_protected and hasattr(apartamento, key):
                setattr(apartamento, key, value)

        db.session.commit()

        return jsonify({
            "msg": "alquiler dado de baja correctamente",
            "association": asociacion.serialize(),
            "apartment": apartamento.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error durante la actualización", "error": str(e)}), 500
