from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

users_api = Blueprint('users', __name__,url_prefix='/user')

bcrypt = Bcrypt()

CORS(users_api)

@users_api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    

    return jsonify({
        "msg":True}), 200

@users_api.route('/create', methods=["POST"])
def create_user():
    data_request = request.get_json()
    

    if not 'email' in data_request or not 'password' or not 'first_name' in data_request:
        return jsonify({"error": "Los campos: first_name, email, password son obligatorios"}), 400

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
        phone=data_request.get("phone_number"),
        national_id=data_request.get("national_id"),
        account_number=data_request.get("account_number"),
        role=data_request["role"]
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
        return jsonify({"error": "Error en el servidor"}), 500

@users_api.route('/login', methods=["POST"])
def sing_in():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email y password son requeridos"}), 400

    user = User.query.filter_by(email=data_request["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data_request["password"]):
        return jsonify({"msg": "El email o la contraseña es incorrecto"}), 401

    try:
     
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "user":user.serialize(),
            "token": access_token
      }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500
    
@users_api.route('/<int:user_id>/contracts/count', methods=["GET"])
@jwt_required()   
def get_user_contracts(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    contracts = user.contract
    count=len(contracts)
    if not contracts:
        return jsonify({"error": "No hay contratos para este usuario"}), 404
    return jsonify(count), 200

