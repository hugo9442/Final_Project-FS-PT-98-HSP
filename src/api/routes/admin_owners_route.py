from flask import request, jsonify, Blueprint
from api.models import db, AdminOwnerProperty, User
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from api.models.users import Role

adminowner_api = Blueprint('adminowner_api', __name__, url_prefix='/adminowner')
CORS(adminowner_api)

# Crear asociación admin-owner
@adminowner_api.route('/associate', methods=['POST'])
@jwt_required()
def create_admin_owner_association():
    try:
        data = request.get_json()
        print (f"Received data: {data}")
        required_fields = ["admin_id", "owner_id"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Faltan campos: {', '.join(missing)}"}), 400

        admin_id = data["admin_id"]
        owner_id = data["owner_id"]

        # Comprobar que admin y owner existen
        admin = User.query.get(admin_id)
        print("Admin found:", admin, "Role:", getattr(admin, 'role', None))
        owner = User.query.get(owner_id)
        if admin.role != Role.ADMIN:
          return jsonify({"error": "Admin no encontrado o no válido"}), 404
      

        # Desactivar cualquier relación activa previa del owner
        existing_relation = AdminOwnerProperty.query.filter_by(owner_id=owner_id, active=True).first()
        if existing_relation:
            existing_relation.active = False
            db.session.add(existing_relation)

        # Crear nueva relación activa
        association = AdminOwnerProperty(admin_id=admin_id, owner_id=owner_id, active=True)
        db.session.add(association)
        db.session.commit()

        return jsonify({
            "message": "Asociación creada exitosamente",
            "association": {
                "id": association.id,
                "admin_id": admin_id,
                "owner_id": owner_id,
                "active": association.active
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

# Obtener todos los owners de un admin
@adminowner_api.route('/owners/<int:admin_id>', methods=['GET'])
@jwt_required()
def get_owners_by_admin(admin_id):
    try:
        admin = User.query.get(admin_id)
        if not admin or  admin.role != Role.ADMIN:
          return jsonify({"error": "Admin no encontrado o no válido"}), 404
           

        # Traer todas las relaciones del admin (activas e inactivas)
        relations = AdminOwnerProperty.query.filter_by(admin_id=admin_id).all()

        owners = []
        for rel in relations:
            owner = User.query.get(rel.owner_id)
            if owner:
                owner_data = owner.serialize()
                owner_data["active"] = rel.active  # añadir estado de la relación
                owners.append(owner_data)

        return jsonify({
            "admin_id": admin_id,
            "owners": owners
        }), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500
