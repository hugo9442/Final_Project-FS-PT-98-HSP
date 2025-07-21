from flask import request, jsonify, Blueprint
from api.models import db, TaxType
from flask_cors import CORS
from flask_jwt_extended import jwt_required

iva_api = Blueprint('iva_api', __name__, url_prefix='/iva')

CORS(iva_api)

@iva_api.route('/', methods=['GET'])
@jwt_required()
def get_tax_types():
    tax_types = TaxType.query.all()
    return jsonify([
        {
            "id": t.id,
            "name": t.name,
            "percentage": float(t.percentage)
        } for t in tax_types
    ]), 200

