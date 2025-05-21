from flask import request, jsonify, Blueprint
from api.models import db, Issue
from flask_cors import CORS

actions_api = Blueprint('actions_api', __name__, url_prefix='/actions')

CORS(actions_api)