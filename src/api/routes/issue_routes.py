from flask import request, jsonify, Blueprint
from api.models import db, Issue
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
issues_api = Blueprint('issues_api', __name__, url_prefix='/issues')

CORS(issues_api)

@issues_api.route('/', methods=["GET"])
@jwt_required()
def get_all_issues():
    issues = Issue.query.all()
    return jsonify([issue.serialize() for issue in issues]), 200

@issues_api.route('/<int:issue_id>', methods=["GET"])
@jwt_required()
def get_issue(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404
    return jsonify(issue.serialize()), 200

@issues_api.route('/<int:apartment_id>', methods=["GET"])
@jwt_required()
def get_issue_by_apartment(apartment_id):
    issues = Issue.query.filter_by(apartment_id=apartment_id).all()
    if not issues:
        return jsonify({"error": "Issue not found"}), 404
    serialized_issues = [issue.serialize() for issue in issues]
    return jsonify({"incidents": serialized_issues}), 200

@issues_api.route('/<int:issue_id>', methods=["PUT"])
@jwt_required()
def update_issue(issue_id):
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    data_request = request.get_json()

    issue.title = data_request.get("title", issue.title)
    issue.description = data_request.get("description", issue.description)
    issue.status = data_request.get("status", issue.status)

    try:
        db.session.commit()
        return jsonify({"msg": "Issue updated", "issue": issue.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500
    
@issues_api.route('/create', methods=["POST"]) 
@jwt_required()
def create_issue():
    data_request = request.get_json()

    if not data_request.get("title") or not data_request.get("description"):
        return jsonify({"error": "The fields: title and description are required"}), 400

    try:
        start_date = datetime.fromisoformat(data_request["start_date"])
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid or missing start_date"}), 400

    end_date = None
    if "end_date" in data_request and data_request["end_date"]:
        try:
            end_date = datetime.fromisoformat(data_request["end_date"])
        except ValueError:
            return jsonify({"error": "Invalid end_date format"}), 400

    new_issue = Issue(
        title=data_request["title"],
        description=data_request["description"],
        status=data_request.get("status", "open"),
        apartment_id=data_request.get("apartment_id"),
        priority=data_request.get("priority", 1),
        type=data_request.get("type", "general"),
        start_date=start_date,
        end_date=end_date
    )

    try:
        db.session.add(new_issue)
        db.session.commit()
        return jsonify({"msg": "Incidencia Creada", "incidencia": new_issue.serialize()}), 201
    except Exception as e:
        import traceback
        print("Error creating issue:", traceback.format_exc())
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500


@issues_api.route('/<int:issue_id>', methods=["DELETE"])
@jwt_required()
def delete_issue(issue_id):
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    try:
        db.session.delete(issue)
        db.session.commit()
        return jsonify({"msg": "Issue deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500

@issues_api.route('/<int:issue_id>/actions', methods=["GET"])
@jwt_required()
def get_issue_actions(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    actions = issue.actions
    if not actions:
        return jsonify({"error": "No actions for this issue"}), 404

    return jsonify([action.serialize() for action in actions]), 200