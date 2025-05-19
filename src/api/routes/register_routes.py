from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

CORS(api)

bcrypt = Bcrypt()

##Login de Hugo
""" 
@api.route('/user/login', methods=["POST"])
def sign_in():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email, password son requeridos"}), 400

    user = User.query.filter_by(email=data_request["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data_request["password"]):
        return jsonify({"msg": "El email o la contraseña es incorrecto"}), 401

    try:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": access_token,
            "user": user.serialize()
        }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500 """


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
