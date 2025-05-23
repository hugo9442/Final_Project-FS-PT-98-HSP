from flask import request, jsonify, Blueprint
from api.models import db, Issue
from flask_cors import CORS
from flask_jwt_extended import jwt_required

actions_api = Blueprint('actions_api', __name__, url_prefix='/actions')

CORS(actions_api)

@actions_api.route('/', methods=["GET"])
@jwt_required()
def get_all_actions():
    actions = Issue.query.all()
    return jsonify([action.serialize() for action in actions]), 200

@actions_api.route('/<int:action_id>', methods=["GET"])
@jwt_required()
def get_action(action_id):
    action = Issue.query.get(action_id)
    if not action:
        return jsonify({"error": "Action not found"}), 404
    return jsonify(action.serialize()), 200

@actions_api.route('/<int:action_id>', methods=["PUT"])
@jwt_required()
def update_action(action_id):
    action = Issue.query.get(action_id)

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

    if not 'title' in data_request or not 'description' in data_request:
        return jsonify({"error": "The fields: title and description are required"}), 400

    new_action = Issue(
        title=data_request["title"],
        description=data_request["description"],
        status=data_request.get("status", "open"),
        apartment_id=data_request.get("apartment_id"),
        priority=data_request.get("priority", 1),
        type=data_request.get("type", "general"),
    )

    try:
        db.session.add(new_action)
        db.session.commit()
        return jsonify({"msg": "Action created", "action": new_action.serialize()}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500
    
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