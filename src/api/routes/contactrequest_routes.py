from flask import request, jsonify, Blueprint, current_app
from api.models import db, ContactRequest
from flask_mail import Message
from api.extensions import mail
from flask_cors import CORS
from datetime import datetime
import re

contact_api = Blueprint('contact_api', __name__, url_prefix='/contacts')

CORS(contact_api)

def is_valid_email(email):
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email)

@contact_api.route('/create', methods=['POST'])
def contact_form():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message_content = data.get("message", "").strip()

    # Validaciones
    if not name:
        return jsonify({"error": "El nombre es obligatorio"}), 400
    if not email or not is_valid_email(email):
        return jsonify({"error": "Email no válido"}), 400
    if not message_content:
        return jsonify({"error": "El mensaje no puede estar vacío"}), 400

    try:
        today_str = datetime.now().strftime("%Y-%m-%d")
        date = datetime.fromisoformat(today_str)
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido (YYYY-MM-DD)"}), 400

    # Guardar en DB
    try:
        contact = ContactRequest(
            name=name,
            email=email,
            message=message_content,
            created_at=date
        )
        db.session.add(contact)
        db.session.commit()
    except Exception as e:
        print("Error guardando en DB:", e)
        return jsonify({"error": "Error interno, intente más tarde"}), 500

    # Enviar email con Flask-Mail
    try:
        msg = Message(
            subject="Nuevo mensaje desde la web",
            recipients=[current_app.config['MAIL_DEFAULT_SENDER']],
            body=f"Nombre: {name}\nEmail: {email}\nMensaje: {message_content}"
        )
        mail.send(msg)
       
        return jsonify({"msg":"Mensaje enviado correctamente"})
    except Exception as e:
        print("Error enviando el email:", e)
        return jsonify({"error": "No se pudo enviar el correo"}), 500
