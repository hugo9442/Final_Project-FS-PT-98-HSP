from flask import request, jsonify, Blueprint
from api.models import db, Contract
from flask_cors import CORS

contracts_api = Blueprint('contracts_api', __name__, url_prefix='/contracts')

CORS(contracts_api)

@contracts_api.route('/', methods=["GET"])
def get_all_contracts():
    contracts = Contract.query.all()
    return jsonify([contract.serialize() for contract in contracts]), 200

@contracts_api.route('/<int:contract_id>', methods=["GET"])
def get_contract(contract_id):
    contract = Contract.query.get(contract_id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404
    return jsonify(contract.serialize()), 200

@contracts_api.route('/<int:contract_id>', methods=["PUT"])
def update_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data_request = request.get_json()

    contract.start_date = data_request.get("start_date", contract.start_date)
    contract.end_date = data_request.get("end_date", contract.end_date)
    contract.owner_id = data_request.get("owner_id", contract.owner_id)

    try:
        db.session.commit()
        return jsonify({"msg": "Contract updated", "contract": contract.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500
    
@contracts_api.route('/create', methods=["POST"])
def create_contract():
    data_request = request.get_json()

    if not 'title' in data_request or not 'description' in data_request:
        return jsonify({"error": "The fields: title and description are required"}), 400

    new_contract = Contract(
        start_date=data_request.get("start_date"),
        end_date=data_request.get("end_date"),
        owner_id=data_request.get("owner_id")
    )

    try:
        db.session.add(new_contract)
        db.session.commit()
        return jsonify({"msg": "Contract created", "contract": new_contract.serialize()}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500