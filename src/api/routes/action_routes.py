from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file
from api.models import db, Action,Issue
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import boto3
from botocore.client import Config
from io import BytesIO
from botocore.exceptions import ClientError
from sqlalchemy.orm import joinedload

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


@actions_api.route('/by-apartment/<int:apartment_id>/no-expenses-docs', methods=['GET'])
@jwt_required()
def get_actions_without_expenses_or_docs(apartment_id):
    try:
        actions = db.session.query(Action).join(Issue).filter(
            Issue.apartment_id == apartment_id,
            ~Action.expenses.any(),
            ~Action.documents.any()
        ).all()

        return jsonify({"msg":"ok","actionlist":[{
            "id": action.id,
            "action_name": action.action_name,
            "start_date": action.start_date.isoformat(),
            "description": action.description,
            "issue_id": action.issue_id
        } for action in actions]}), 200

    except Exception as e:
        return jsonify({"error": "No se pudieron obtener las acciones filtradas", "details": str(e)}), 500


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
    data_request = request.get_json()

    # Verificar campos obligatorios
    required_fields = ['description', 'action_name', 'contractor_id','start_date', 'issue_id']
    missing_fields = [field for field in required_fields if field not in data_request]
    if missing_fields:
        return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

    try:
        start_date = datetime.fromisoformat(data_request["start_date"])
    except ValueError:
        return jsonify({"error": "Fecha de inicio inválida"}), 400

    try:
        new_action = Action(
            action_name=data_request["action_name"],
            start_date=start_date,
            description=data_request["description"],
            contractor_id=data_request["contractor_id"],
            issue_id=data_request["issue_id"]
        )

        db.session.add(new_action)
        db.session.commit()

        return jsonify({
            "msg": "Acción creada exitosamente",
            "id": new_action.id,  # útil para frontend
            "action": new_action.serialize()
        }), 201

    except ValueError:
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
    action = Action.query.get(action_id)

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

@actions_api.route('/<int:action_id>/close', methods=["PUT"])
@jwt_required()
def close_action(action_id):
    action = Action.query.get(action_id)

    if not action:
        return jsonify({"error": "Actuación no encontrada"}), 404

    if action.status.lower() == "cerrado":
        return jsonify({"msg": "La incidencia ya está cerrada"}), 200

    try:
        action.status = "cerrado" 
        db.session.commit()
        return jsonify({"msg": "Incidencia actualizada a cerrada", "issue": action.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar la actuación:", e)
        return jsonify({"error": "Error en el servidor"}), 500