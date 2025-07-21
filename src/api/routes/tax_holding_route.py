from flask import request, jsonify, Blueprint
from api.models import db, Withholding
from flask_cors import CORS
from flask_jwt_extended import jwt_required

taxhold_api = Blueprint('taxhold_api', __name__, url_prefix='/taxhold')

CORS(taxhold_api)


@taxhold_api.route('/', methods=['GET'])
@jwt_required()
def get_withholdings():
    
    withholdings = Withholding.query.all()
    return jsonify([
        {
            "id": w.id,
            "name": w.name,
            "percentage": float(w.percentage)
        } for w in withholdings
    ]), 200