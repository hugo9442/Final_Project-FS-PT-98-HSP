from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import extract, func, case
from api.models import db, Invoice
from datetime import datetime
from flask_cors import CORS
import calendar

dashboard_api = Blueprint('dashboard_api', __name__,url_prefix='/dashboard')


CORS(dashboard_api)

@dashboard_api.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    try:
        year = datetime.now().year

        total_facturado = db.session.query(func.sum(Invoice.bill_amount))\
            .filter(func.extract('year', Invoice.date) == year).scalar() or 0

        total_pendiente = db.session.query(func.sum(Invoice.bill_amount))\
            .filter(Invoice.status == 'pendiente').scalar() or 0

        total_cobrado = db.session.query(func.sum(Invoice.bill_amount))\
            .filter(Invoice.status == 'cobrada').scalar() or 0

        facturacion_mensual = db.session.query(
            func.extract('month', Invoice.date).label('month'),
            func.sum(Invoice.bill_amount)
        ).filter(func.extract('year', Invoice.date) == year)\
        .group_by('month').order_by('month').all()

        return jsonify({
            "total_facturado": float(total_facturado),
            "total_pendiente": float(total_pendiente),
            "total_cobrado": float(total_cobrado),
            "facturacion_mensual": [
                {"month": int(m), "amount": float(a)} for m, a in facturacion_mensual
            ]
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error interno"}), 500
    
@dashboard_api.route('/monthly-summary', methods=['GET'])
@jwt_required()
def get_monthly_summary():
    try:
        # Agrupa por año y mes
        results = db.session.query(
            extract('year', Invoice.date).label('year'),
            extract('month', Invoice.date).label('month'),
            func.sum(Invoice.bill_amount).label('total'),
            func.sum(
                case(
                    (Invoice.status == 'pendiente', Invoice.bill_amount),
                    else_=0
                )
            ).label('pendiente')
        ).group_by('year', 'month')\
         .order_by('year', 'month')\
         .all()

        data = []
        for row in results:
            data.append({
                "year": int(row.year),
                "month": calendar.month_name[int(row.month)],
                "amount": float(row.total),
                "pending": float(row.pendiente)
            })

        return jsonify({
            "msg": "Resumen mensual obtenido correctamente",
            "facturacion_mensual": data
        }), 200
    except Exception as e:
        print("Error en get_monthly_summary:", e)
        return jsonify({"error": "Error al obtener el resumen mensual"}), 500