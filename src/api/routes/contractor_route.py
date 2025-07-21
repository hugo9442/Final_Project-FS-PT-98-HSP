from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required
from api.models import db, Contractor
from flask_cors import CORS
contractor_api = Blueprint('contractor_api', __name__, url_prefix='/contractor')

CORS(contractor_api)

@contractor_api.route('/', methods=["GET"])
@jwt_required()
def get_all_actions():
    contractors = Contractor.query.all()
    return jsonify({"msg": "ok", "contractor":[contractor.serialize() for contractor in contractors]}), 200

@contractor_api.route('/create', methods=["POST"])
@jwt_required()
def create_contractor():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        new_contractor = Contractor(
            name=data.get("name"),
            nif=data.get("cif"),
            phone=data.get("phone"),
            email=data.get("email"),
            name_contact=data.get("name_contact"),
            notes=data.get("notes")
        )

        db.session.add(new_contractor)
        db.session.commit()
        return jsonify({"msg": "ok", "contractor": new_contractor.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "error", "error": str(e)}), 500