from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

CORS(api)

bcrypt = Bcrypt()

@api.route('/user', methods=["GET"])
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/user/<int:user_id>', methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user.serialize_with_relations()), 200

@api.route('/user/<int:user_id>', methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data_request = request.get_json()

    if 'email' in data_request:
        existing_user = User.query.filter_by(email=data_request["email"]).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"error": "El email ya está registrado"}), 409

    user.first_name = data_request.get("first_name", user.first_name)
    user.last_name = data_request.get("last_name", user.last_name)
    user.phone = data_request.get("phone", user.phone)
    user.national_id = data_request.get("national_id", user.national_id)
    user.account_number = data_request.get("account_number", user.account_number)
    user.roll = data_request.get("roll", user.roll)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario actualizado", "user": user.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500

@api.route('/user/create', methods=["POST"])
def create_user():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email y password son obligatorios"}), 400

    if '@' not in data_request["email"] or len(data_request["password"]) < 8:
        return jsonify({"error": "Email o contraseña inválidos"}), 400

    email = data_request["email"].strip().lower()

    existing_user = User.query.filter_by(email=data_request["email"]).first()
    if existing_user:
        return jsonify({"error": "El email ya está registrado"}), 409
    
    new_user = User(
        first_name=data_request["first_name"],
        last_name=data_request["last_name"],
        email=email,
        password=bcrypt.generate_password_hash(data_request["password"]).decode('utf-8'),
        phone_number=data_request.get("phone_number"),
        national_id=data_request.get("national_id"),
        account_number=data_request.get("account_number")
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            "msg": "Usuario creado",
            "token": access_token,
            "user": new_user.serialize()
        }), 201
    
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500
    
@api.route('/user/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500