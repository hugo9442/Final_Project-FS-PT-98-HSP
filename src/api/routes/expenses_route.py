from flask import Blueprint, request, jsonify
from api.models import Expense, db,Apartment
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract
import calendar

expenses_api = Blueprint("expenses", __name__,url_prefix='/expenses')


CORS(expenses_api)

@expenses_api.route('/monthly-summary', methods=['GET'])
@jwt_required()
def get_monthly_expenses_summary():
    current_year = datetime.now().year

    results = (
        db.session.query(
            extract('month', Expense.date).label('month'),
            func.sum(Expense.received_invoices).label('total_gastos')
        )
        .filter(
            extract('year', Expense.date) == current_year
        )
        .group_by('month')
        .order_by('month')
        .all()
    )

    MESES_ES = [
        "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    summary = []
    for month_num, total in results:
        month_name = MESES_ES[int(month_num)]
        summary.append({
            "month": month_name,
            "gastos": float(total) if total else 0
        })

    full_summary = []
    for m in range(1, 13):
        month_name = MESES_ES[m]
        found = next((item for item in summary if item["month"] == month_name), None)
        full_summary.append({
            "month": month_name,
            "gastos": found["gastos"] if found else 0
        })

    return jsonify({"gastos_mensuales": full_summary}), 200

@expenses_api.route('/by-apartment/<int:apartment_id>', methods=["GET"])
@jwt_required()
def get_expenses_by_apartment(apartment_id):
    # Consulta todos los expenses que pertenecen al apartment_id
    expenses = Expense.query.filter_by(apartment_id=apartment_id).all()
    
    # Serializa cada expense con sus relaciones usando serialize_with_relations
    serialized_expenses = [expense.serialize_with_relations() for expense in expenses]
    
    return jsonify({
        'success': True,
        'expenses': serialized_expenses,
        'count': len(serialized_expenses)
    })

@expenses_api.route('/by-contractor/<int:contractor_id>', methods=["GET"])
@jwt_required()
def get_expenses_by_(contractor_id):
    # Consulta todos los expenses que pertenecen al apartment_id
    expenses = Expense.query.filter_by(contractor_id=contractor_id).all()
   
    
    # Serializa cada expense con sus relaciones usando serialize_with_relations
    serialized_expenses = [expense.serialize_with_relations() for expense in expenses]
    
    return jsonify({
        'success': True,
        'expenses': serialized_expenses,
        'count': len(serialized_expenses)
    })


@expenses_api.route('/', methods=["GET"])
@jwt_required()
def get_expenses():
    # Consulta todos los expenses que pertenecen al apartment_id
    expenses = Expense.query.all()
    
   
    
    return jsonify({
        'success': True,
        'expenses': [expense.serialize() for expense in expenses],
        'count': len(expenses)
    })




@expenses_api.route("/create", methods=["POST"])
@jwt_required()
def create_expense():
    data = request.json

    # Validar que al menos received_invoices o payed_invoices venga y sea válido
    received = data.get("received_invoices")
    payed = data.get("payed_invoices")

    if (received is None or received == "") and (payed is None or payed == ""):
        return jsonify({
            "msg": "error",
            "details": "Debe proporcionar al menos received_invoices o payed_invoices"
        }), 400

    try:
       
        date_str = data.get("date")
        date = datetime.fromisoformat(date_str)

    
        received_val = float(received) if received not in [None, ""] else None
        payed_val = float(payed) if payed not in [None, ""] else None

        expense = Expense(
            description=data["description"],
            date=date,
            received_invoices=received_val,
            payed_invoices=payed_val,
            apartment_id=int(data["apartment_id"]),
            contractor_id=int(data["contractor_id"]),
            category_id = int(data["category_id"]),
            document_id=data.get("document_id"),
            action_id=data.get("action_id")  
        )

        db.session.add(expense)
        db.session.commit()

        return jsonify({"msg": "ok", "expense_id": expense.serialize()}), 201

    except ValueError:
        return jsonify({"msg": "error", "details": "Fecha inválida, debe ser formato ISO"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "error", "details": str(e)}), 400
    
@expenses_api.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_expense(id):
    data = request.json

    expense = db.session.get(Expense, id)
    if not expense:
        return jsonify({"msg": "error", "details": "Expense no encontrado"}), 404

    try:
        # Actualizar solo campos permitidos
        if "received_invoices" in data:
            value = data["received_invoices"]
            expense.received_invoices = float(value) if value not in [None, ""] else None

        if "payed_invoices" in data:
            value = data["payed_invoices"]
            expense.payed_invoices = float(value) if value not in [None, ""] else None

        if "document_id" in data:
            expense.document_id = data["document_id"]

        if "action_id" in data:
            expense.action_id = data["action_id"]

        # Validar que al menos uno esté informado
        if expense.received_invoices is None and expense.payed_invoices is None:
            return jsonify({
                "msg": "error",
                "details": "Debe tener al menos received_invoices o payed_invoices"
            }), 400

        db.session.commit()
        return jsonify({"msg": "ok", "expense_id": expense.id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "error", "details": str(e)}), 400

