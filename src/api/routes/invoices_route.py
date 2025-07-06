from flask import request, jsonify, Blueprint
from api.models import db, Invoice
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone


invoices_api = Blueprint('invoice_api', __name__, url_prefix='/invoices')

CORS(invoices_api)


@invoices_api.route('/', methods=['GET'])
@jwt_required()
def get_invoices():
    try:
        invoices = Invoice.query.order_by(Invoice.date.desc()).all()
        result = [invoice.serialize_wit_owner() for invoice in invoices]
        return jsonify({
            "msg": "Listado de facturas",
            "invoices": result
        }), 200
    except Exception as e:
        print("Error al obtener facturas:", e)
        return jsonify({"error": "Error en el servidor"}), 500


@invoices_api.route('/create', methods=['POST'])
@jwt_required()
def create_invoice():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No data provided"}), 400
    
    if body.get("status") not in ["pendiente", "cobrada"]:
        return jsonify({"error": "Estado no válido. Usa 'pendiente' o 'cobrada'"}), 400
    
    required_fields = ["status", "description", "bill_amount", "association_id", "tenant_id", "owner_id"]
    missing_fields = [field for field in required_fields if field not in body or body[field] is None]
    if missing_fields:
        return jsonify({"error": f"Faltan campos requeridos: {', '.join(missing_fields)}"}), 400

    try:
        # Si viene date en el body, úsala, si no, usa hoy
        if "date" in body and body["date"]:
            date = datetime.fromisoformat(body["date"])
        else:
            today_str = datetime.now().strftime("%Y-%m-%d")
            date = datetime.fromisoformat(today_str)
    except ValueError:
        return jsonify({"error": "Invalid date format (must be YYYY-MM-DD)"}), 400

    tenant_id = body.get("tenant_id")

    # Buscar última factura por tenant_id
    last_invoice = Invoice.query.filter_by(tenant_id=tenant_id)\
                                .order_by(Invoice.date.desc())\
                                .first()

    if last_invoice:
        if last_invoice.date.year == date.year and last_invoice.date.month == date.month:
            return jsonify({"msg":"ok"}), 200

    try:
        new_invoice = Invoice(
            status=body.get("status"),
            date=date,
            description=body.get("description"),
            bill_amount=float(body.get("bill_amount")),
            association_id=body.get("association_id"),
            owner_id=body.get("owner_id"),
            tenant_id=tenant_id,
        )
        db.session.add(new_invoice)
        db.session.commit()
        return jsonify({
            "invoice": [new_invoice.serialize()],
            "msg": "La Factura se ha creado con éxito"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error en el servidor: {str(e)}"}), 500


@invoices_api.route('/<int:invoice_id>', methods=['PUT'])
@jwt_required()
def update_invoice(invoice_id):
    body = request.get_json()

    if not body:
        return jsonify({"msg": "No data provided"}), 400

    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"error": "Factura no encontrada"}), 404

    # Validar status si viene
    if "status" in body:
        if body["status"] not in ["pendiente", "cobrada"]:
            return jsonify({"error": "Estado no válido. Usa 'pendiente' o 'cobrada'"}), 400
        invoice.status = body["status"]

    # Validar date si viene
    if "date" in body:
        try:
            invoice.date = datetime.fromisoformat(body["date"])
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD"}), 400

    # Actualizar otros campos si llegan
    if "description" in body:
        invoice.description = body["description"]
    if "bill_amount" in body:
        try:
            invoice.bill_amount = int(body["bill_amount"])
        except ValueError:
            return jsonify({"error": "bill_amount debe ser un número"}), 400

    try:
        db.session.commit()
        return jsonify({
            "msg": "Factura actualizada correctamente",
            "invoice": invoice.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error en el servidor: {str(e)}"}), 500
