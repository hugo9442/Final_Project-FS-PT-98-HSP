from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import extract, func, case
from api.models import db, Invoice, User, AdminOwnerProperty
from api.models.users import Role  
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
    
@dashboard_api.route('/', methods=['GET'])
@jwt_required()
def get_monthly_summary_all():
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
        MESES_ES = [
        "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
       ]
        data = []
        for row in results:
            data.append({
                "year": int(row.year),
                "month": MESES_ES[int(row.month)],
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
    
from sqlalchemy import func, case, extract

@dashboard_api.route('/monthly-summary', methods=['GET'])
@jwt_required()
def get_monthly_summary():
    try:
        # Obtener usuario actual desde token
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # 🔹 ADMIN → obtiene todos los propietarios que gestiona
        if user.role == Role.ADMIN:
            # Relaciones activas entre admin y propietarios
            relations = AdminOwnerProperty.query.filter_by(admin_id=user.id, active=True).all()
            owner_ids = [rel.owner_id for rel in relations]

            # Facturas de esos propietarios
            query = db.session.query(
                extract('year', Invoice.date).label('year'),
                extract('month', Invoice.date).label('month'),
                func.sum(Invoice.bill_amount).label('total'),
                func.sum(
                    case(
                        (Invoice.status == 'pendiente', Invoice.bill_amount),
                        else_=0
                    )
                ).label('pendiente')
            ).filter(Invoice.owner_id.in_(owner_ids))

        # 🔹 PROPIETARIO → solo sus facturas
        elif user.role == Role.PROPIETARIO:
            query = db.session.query(
                extract('year', Invoice.date).label('year'),
                extract('month', Invoice.date).label('month'),
                func.sum(Invoice.bill_amount).label('total'),
                func.sum(
                    case(
                        (Invoice.status == 'pendiente', Invoice.bill_amount),
                        else_=0
                    )
                ).label('pendiente')
            ).filter(Invoice.owner_id == user.id)

        else:
            return jsonify({"error": "Rol no autorizado"}), 403

        # Agrupar y ordenar por año y mes
        results = query.group_by('year', 'month').order_by('year', 'month').all()

        MESES_ES = [
            "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ]

        data = []
        for row in results:
            data.append({
                "year": int(row.year),
                "month": MESES_ES[int(row.month)],
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

