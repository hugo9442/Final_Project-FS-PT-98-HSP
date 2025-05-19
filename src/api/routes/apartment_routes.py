from flask import request, jsonify, Blueprint
from api.models import db, User, Apartment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

apartments_api = Blueprint('apartments_api', __name__)


CORS(api)

bcrypt = Bcrypt()

@apartments_api.route('/apartment', methods=['POST'])
def create_apartment():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "No data provided"}), 400

    try:
        new_apartment = Apartment(**body)
        db.session.add(new_apartment)
        db.session.commit()
        return jsonify(new_apartment.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/apartment/<int:id>', methods=['GET'])
def get_apartment(id):
    try:
        apartment = Apartment.query.get(id)
        if not apartment:
            return jsonify({"msg": "Apartment not found"}), 404
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/apartments', methods=['GET'])
def get_apartments():
    try:
        apartments = Apartment.query.all()
        return jsonify([apartment.serialize() for apartment in apartments]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/apartment/<int:id>', methods=['PUT'])
def update_apartment(id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "No data provided"}), 400

    apartment = Apartment.query.get(id)

    if not apartment:
        return jsonify({"msg": "Apartment not found"}), 404
    

    try:
        for key, value in body.items():
            if hasattr(apartment, key):
                setattr(apartment, key, value)
        db.session.commit()
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500