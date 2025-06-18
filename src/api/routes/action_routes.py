from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file
from api.models import db, Action
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import boto3
from botocore.client import Config
from io import BytesIO
from botocore.exceptions import ClientError

actions_api = Blueprint('actions_api', __name__, url_prefix='/actions')

CORS(actions_api)

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=os.getenv("R2_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"), 
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )

@actions_api.route('/', methods=["GET"])
@jwt_required()
def get_all_actions():
    actions = Action.query.all()
    return jsonify([action.serialize() for action in actions]), 200

@actions_api.route('/<int:action_id>', methods=["GET"])
@jwt_required()
def get_action(action_id):
    action = Action.query.get(action_id)
    if not action:
        return jsonify({"error": "Action not found"}), 404
    return jsonify(action.serialize()), 200

@actions_api.route('/<int:action_id>', methods=["PUT"])
@jwt_required()
def update_action(action_id):
    action = Action.query.get(action_id)
    
    if not action:
        return jsonify({"error": "Action not found"}), 404

    data_request = request.get_json()

    try:
        for key, value in data_request.items():
            if hasattr(action, key):
                setattr(action, key, value)
        db.session.commit()
        return jsonify({"msg": "Action updated", "action": action.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500
    
@actions_api.route('/create', methods=["POST"])
@jwt_required()
def create_action():
    data_request = request.form 

    # Verificar campos obligatorios
    required_fields = ['description', 'action_name', 'contractor', 'bill_amount', 'start_date', 'issue_id']
    missing_fields = [field for field in required_fields if field not in data_request]
    if missing_fields:
        return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400
    
    try:
        start_date = datetime.fromisoformat(data_request["start_date"])
    except (KeyError, ValueError):
        return jsonify({"error": "Fecha de inicio inválida o faltante"}), 400
    
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf'}

    file_url = None

    # Manejo del archivo (opcional)
    if 'bill_image' in request.files:
        file = request.files['bill_image']
        
        if file.filename != '':
            if not allowed_file(file.filename):
                return jsonify({"error": "Solo se permiten archivos PDF"}), 400

            original_name = secure_filename(file.filename)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_filename = f"{original_name.rsplit('.', 1)[0]}_{timestamp}.pdf"
            
            try:
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)
                
                if file_size == 0:
                    return jsonify({"error": "El archivo está vacío"}), 400
                
                s3 = get_r2_client()
                s3.upload_fileobj(
                    file,
                    os.getenv("R2_BUCKET_NAME"),
                    unique_filename,
                    ExtraArgs={
                        'ContentType': 'application/pdf',
                        'ACL': 'private'
                    }
                )

                file_url = f"{os.getenv('R2_PUBLIC_URL')}/{unique_filename}"


            except Exception as e:
                current_app.logger.error(f"Error al subir archivo: {str(e)}", exc_info=True)
                return jsonify({
                    "error": "Error al procesar el archivo",
                    "details": str(e)
                }), 500

    try:
        new_action = Action(
            status=data_request.get("status", "open"),
            action_name=data_request["action_name"],
            start_date=start_date,
            description=data_request["description"],
            contractor=data_request["contractor"],
            bill_amount=int(data_request["bill_amount"]),
            bill_image=file_url,
            issue_id=data_request["issue_id"],
            
        )

        db.session.add(new_action)
        db.session.commit()
        
        return jsonify({
            "msg": "Acción creada exitosamente", 
            "action": new_action.serialize()  # Usando tu método serialize correctamente
        }), 201
    
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": "bill_amount debe ser un número entero"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error al crear acción: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Error al crear la acción",
            "details": str(e)
        }), 500
    
@actions_api.route('/<int:action_id>', methods=["DELETE"])
@jwt_required()
def delete_action(action_id):
    action = Issue.query.get(action_id)

    if not action:
        return jsonify({"error": "Action not found"}), 404

    try:
        db.session.delete(action)
        db.session.commit()
        return jsonify({"msg": "Action deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500