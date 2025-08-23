from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from api.models import db, User
from api.models.users import Role
from flask_jwt_extended import create_access_token
from flask_cors import CORS
import requests
import uuid
from flask_bcrypt import Bcrypt

auth_api = Blueprint('auth_api', __name__, url_prefix='/auth')

bcrypt = Bcrypt()

CORS(auth_api)
CLIENT_ID = "1058689824659-4gqh5dnaaihmujtmhqrc8lo3ao5pgo3s.apps.googleusercontent.com"
@auth_api.route('/login/google', methods=['POST'])
def login_google():
    data_request = request.get_json()

    if not 'token' in data_request or not 'role' in data_request:
        return jsonify({"error": "Token y role son requeridos"}), 400

    token = data_request["token"]
    role = data_request["role"]

    # Validamos el token con Google
    google_api_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    google_response = requests.get(google_api_url)

    if google_response.status_code != 200:
        return jsonify({"error": "Token de Google inválido"}), 401

    google_data = google_response.json()
    email = google_data.get("email")
    firstname = google_data.get("given_name")
    lastname = google_data.get("family_name")

    if not email:
        return jsonify({"error": "No se pudo obtener el email de Google"}), 400

    # Buscamos usuario existente
    user = User.query.filter_by(email=email).first()
    temporary_password = str(uuid.uuid4())
    hashed_temporary_password = bcrypt.generate_password_hash(
        temporary_password).decode('utf-8')
    if not user:
        user_role = Role(role)
        if role not in [r.value for r in Role]:
            return jsonify({"error": "Role inválido"}), 400
        # Usuario no existe → lo creamos
        new_user = User(
            first_name=firstname,
            last_name=lastname,
            email=email,
            password=hashed_temporary_password,  # contraseña vacía o aleatoria
            phone=None,
            national_id=None,
            account_number=None,
            role=user_role,
            status=None  # no tiene suscripción aún
        )
        db.session.add(new_user)
        db.session.commit()  
        user = new_user

        # Opcional: generar token incluso para usuario recién creado
        access_token = create_access_token(identity=str(new_user))
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf-8')

        return jsonify({
            "message": "Usuario creado y login exitoso",
            "access": "full",
            "user": user.serialize(),
            "token": access_token,
            "created": True
        }), 201

    # Usuario existe → aplicamos condicionales de Stripe
    status = user.status

    if status in ["active", "trialing"]:
        access_token = create_access_token(identity=str(user.id))
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf-8')
        return jsonify({
            "message": "Login exitoso",
            "access": "full",
            "user": user.serialize(),
            "token": access_token
        }), 200

    elif status == "past_due":
        return jsonify({
            "error": "Tu suscripción está pendiente de pago",
            "access": "limited"
        }), 403

    elif status in ["canceled", "unpaid"]:
        return jsonify({
            "error": "Tu suscripción ha sido cancelada",
            "access": "blocked"
        }), 403

    elif status in ["incomplete", "incomplete_expired"]:
        return jsonify({
            "error": "Pago inicial incompleto, no puedes acceder",
            "access": "blocked"
        }), 403

    else:
        return jsonify({
            "error": "Estado de suscripción desconocido",
            "access": "blocked"
        }), 403