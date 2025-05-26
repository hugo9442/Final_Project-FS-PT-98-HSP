from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort
from api.models import db, Contract
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os


contracts_api = Blueprint('contracts_api', __name__, url_prefix='/contracts')

CORS(contracts_api)

@contracts_api.route('/', methods=["GET"])
@jwt_required()
def get_all_contracts():
    contracts = Contract.query.all()
    return jsonify([contract.serialize() for contract in contracts]), 200

@contracts_api.route('/<int:contract_id>', methods=["GET"])
@jwt_required()
def get_contract(contract_id):
    contract = Contract.query.get(contract_id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404
    return jsonify(contract.serialize()), 200

@contracts_api.route('/<int:contract_id>', methods=["PUT"])
@jwt_required()
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

@contracts_api.route('/download/<filename>',methods=['GET'])
@jwt_required()  
def download_file(filename):
    if not filename or '.' not in filename:
        return({"msg":"Nombre de archivo inválido"})
    
    upload_folder = current_app.config['UPLOAD_FOLDER']
   
    return send_from_directory(
        directory=upload_folder,
        path=filename,
        as_attachment=True  # Opcional: fuerza la descarga en lugar de mostrar en navegador
    )

@contracts_api.route('/create', methods=['POST'])
@jwt_required()
def create_contract():

    
    def allowed_file(filename):
        print(filename)
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in {'pdf'}
    
    # Verificar si el archivo es parte de la petición
    if 'document' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['document']
    
    # Si el usuario no selecciona archivo
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    # Validar tipo de archivo
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(filepath)
            
            
            new_contract = Contract(
                start_date=datetime.fromisoformat(request.form['start_date']),
                end_date=datetime.fromisoformat(request.form['end_date']),
                owner_id=request.form['owner_id'],
                document=filename
            )
            
            db.session.add(new_contract)
            db.session.commit()

            file_url = url_for('contracts_api.download_file', filename=filename, _external=True)
            
            
            return jsonify({
                "message": "El contrato ha sido registrado satisfactoriamente",
                "file_url": file_url,
                "contract": new_contract.serialize()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "File type not allowed"}), 400


"""@contracts_api.route('/create', methods=["POST"])
@jwt_required()
def create_contract():
    data_request = request.get_json()
    

    if not 'start_date' in data_request or not 'end_date' in data_request:
        return jsonify({"error": "The fields: start_date and end_date are required"}), 400

    new_contract = Contract(
        start_date=datetime.fromisoformat(data_request["start_date"]),
        end_date=datetime.fromisoformat(data_request["end_date"]),
        owner_id=data_request.get("owner_id"),
        document=data_request.get("document")
    )

    try:
        db.session.add(new_contract)
        db.session.commit()
        return jsonify({"msg": "Contract created", "contract": new_contract.serialize()}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500"""

@contracts_api.route('/<int:contract_id>', methods=["DELETE"])
@jwt_required()
def delete_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    try:
        db.session.delete(contract)
        db.session.commit()
        return jsonify({"msg": "Contract deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500