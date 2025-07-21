from flask import Blueprint, request, jsonify
from api.models import ExpensePayment, Expense, db
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import jwt_required
from decimal import Decimal

expensespayments_api = Blueprint("expensespayments", __name__,url_prefix='/expensespayments')


CORS(expensespayments_api)

@expensespayments_api.route('/create', methods=["POST"])
@jwt_required()
def create_expense_payment():
    data = request.get_json()

    # Validaciones básicas
    expense_id = data.get("expense_id")
    amount = data.get("amount")
    payment_date = data.get("payment_date")  # formato esperado: "YYYY-MM-DD"

    if not all([expense_id, amount, payment_date]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        expense = Expense.query.get(expense_id)
        if not expense:
            return jsonify({"error": "Expense no encontrado"}), 404

        # Creamos el nuevo pago
        new_payment = ExpensePayment(
            expense_id=expense_id,
            amount=amount,
            payment_date=datetime.strptime(payment_date, "%Y-%m-%d")
        )
        
        if expense.payed_invoices is None:
            expense.payed_invoices = 0
        expense.payed_invoices += Decimal(str(amount))
    

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({
            "success": True,
            "payment": new_payment.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
