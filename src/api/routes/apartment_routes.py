from flask import request, jsonify, Blueprint
from api.models import db, Apartment
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from sqlalchemy import func

apartments_api = Blueprint('apartments_api', __name__, url_prefix='/apartments')

CORS(apartments_api)

@apartments_api.route('/<int:id>/issues-actions', methods=['GET'])
@jwt_required()
def get_apartment_issues_and_actions(id):
    try:
        apartment = Apartment.query.get(id)
        if not apartment:
            return jsonify({"error": "Apartment not found"}), 404

        # Serializa la información completa del apartamento
        apartment_data = apartment.serialize()

        # Serializa cada issue con sus actions
        issues_data = []
        for issue in apartment.issues:
            issue_data = issue.serialize()
            issue_data["actions"] = [action.serialize() for action in list(issue.actions)]
            issues_data.append(issue_data)

        # Agrega los issues al objeto apartment
        apartment_data["issues"] = issues_data

        return jsonify(apartment_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



@apartments_api.route('/create', methods=['POST'])
@jwt_required()
def create_apartment():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No data provided"}), 400
    
    new_apartment = Apartment(
        address=body.get("address"),
        postal_code=body.get("postal_code"),
        city=body.get("city"),
        parking_slot=body.get("parking_slot"),
        type=body.get("type"),
        owner_id=body.get("owner_id"),
        is_rent =body.get("is_rent")
    )
    
    try:
        new_apartment = Apartment(**body)
        db.session.add(new_apartment)
        db.session.commit()
        return jsonify({"apartments":[new_apartment.serialize()],
                        "msg":"La vivienda se ha registrado con exito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_apartment(id):
    try:
        apartment = Apartment.query.get(id)
        if not apartment:
            return jsonify({"msg": "Apartment not found"}), 404
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    

@apartments_api.route('/with-documents', methods=['GET'])
@jwt_required()
def get_apartments_with_documents():
    try:
        apartments = Apartment.query.all()
        result = []
        for apartment in apartments:
            if apartment.documents and len(apartment.documents) > 0:
                apartment_data = apartment.serialize()  # Serializa datos del apartamento
                apartment_data['documents'] = [doc.serialize() for doc in apartment.documents]
                result.append(apartment_data)

        return jsonify({
            "msg": "ok",
            "apartments": result
        }), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/', methods=['GET'])
@jwt_required()
def get_apartments():
    try:
        apartments = Apartment.query.all()
        return jsonify({"msg":"ok", "apartments": [apartment.serialize_with_owner_name() for apartment in apartments]}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/notrented', methods=['GET'])
@jwt_required()
def get_apartments_not_rented():
    try:
        apartments = Apartment.query.filter_by(is_rent=False).all()
        return jsonify({"msg":"ok", "apartments": [apartment.serialize_with_owner_name() for apartment in apartments]}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/count', methods=['GET'])
@jwt_required()
def get_apartmentscount():
   try:
        total_apartments = db.session.query(func.count(Apartment.id)).scalar()

        return jsonify({
            "msg": "ok",
            "total": total_apartments
        }), 200
   except Exception as e:
        print("Error al obtener apartamentos:", e)
        return jsonify({"msg": "Error en el servidor"}), 500
    
@apartments_api.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_apartment(id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "No data provided"}), 400

    apartment = Apartment.query.get(id)

    if not apartment:
        return jsonify({"msg": "Apartment not found"}), 404
    protected_fields = ["id", "owner_id"]
    try:
        for key, value in body.items():
            if key in protected_fields:
                continue
            if hasattr(apartment, key):
                setattr(apartment, key, value)
        db.session.commit()
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_apartment(id):
    apartment = Apartment.query.get(id)

    if not apartment:
        return jsonify({"msg": "Apartment not found"}), 404

    try:
        db.session.delete(apartment)
        db.session.commit()
        return jsonify({"msg": "Apartment deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500