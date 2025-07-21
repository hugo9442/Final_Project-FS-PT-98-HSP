from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from api.models import db, ExpenseCategory
from flask_cors import CORS


expense_category_api = Blueprint('expense_category_api', __name__, url_prefix='/categories')

CORS(expense_category_api)

@expense_category_api.route('/', methods=["GET"])
@jwt_required()
def get_expense_categories():
    try:
        categories = ExpenseCategory.query.all()
        return jsonify({
            "msg": "ok",
            "categories": [cat.serialize() for cat in categories]
        }), 200
    except Exception as e:
        return jsonify({"msg": "error", "error": str(e)}), 500
