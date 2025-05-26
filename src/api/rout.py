

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/public', methods=['GET'])
def public_route():

    response_body = {
        "message": "Hola soy una ruta pública"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['GET'])
def get_user():
    raw_list_user=User.query.all()
    users_list=[users.serialize() for users in raw_list_user]
    return jsonify(users_list), 



@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify({
        "confirmation":True
        }), 200



@api.route('/user/login', methods=["POST"])
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


