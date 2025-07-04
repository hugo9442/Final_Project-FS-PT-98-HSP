from flask import request, jsonify, Blueprint
from api.models import db, Invoice
from flask_cors import CORS
from flask_jwt_extended import jwt_required

invoices_api = Blueprint('invoice_api', __name__, url_prefix='/invoices')

CORS(invoices_api)


@invoices_api.route('/create', methods=['POST'])
@jwt_required()
def create_invoice():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No data provided"}), 400
    
    new_invoice = Invoice(
        status=body.get("status"),
        date=body.get("date"),
        description=body.get("description"),
        bill_amount=body.get("bill_amount"),
        association_id=body.get("association_id"),
        tenant_id=body.get("owner_id"),
        is_rent =body.get("is_rent")
    )
    
    try:
        new_invoice = Invoice(**body)
        db.session.add(new_invoice)
        db.session.commit()
        return jsonify({"apartments":[new_invoice.serialize()],
                        "msg":"La Factura se ha creado con exito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500