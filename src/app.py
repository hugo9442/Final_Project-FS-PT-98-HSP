
import os
import threading
from pathlib import Path
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.models.users import Role
from api.routes import apartments_api, users_api, contracts_api, issues_api, actions_api, asociates_api, documents_api, invoices_api, contact_api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from datetime import timedelta
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import generate_password_hash
from api.extensions import mail

env_path = Path(__file__).resolve().parent.parent / '.env'  # Sube dos niveles desde src/
load_dotenv(env_path)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'pdf'}  # Solo permitir PDFs

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

if os.getenv('CODESPACES'):
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  
app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS
app.config["JWT_SECRET_KEY"] =os.getenv("SECRET_KEY") 
app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt=JWTManager(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

app.register_blueprint(users_api)
app.register_blueprint(apartments_api)
app.register_blueprint(contracts_api)
app.register_blueprint(issues_api)
app.register_blueprint(actions_api)
app.register_blueprint(asociates_api)
app.register_blueprint(documents_api)
app.register_blueprint(invoices_api)
app.register_blueprint(contact_api)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER') 
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() in ('true', '1', 't') 
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False').lower() in ('true', '1', 't')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail.init_app(app)

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response
def initialize_admin_user():
    with app.app_context():
        db.create_all()

        # Solo crea el admin si no existe
        if not User.query.filter_by(email="montoria@montoria.es").first():
            admin = User(
                first_name="Admin",
                last_name="General",
                email="montoria@montoria.es",
                password= generate_password_hash("M0nt0r14@2025").decode('utf-8'),
                phone="000000000",
                national_id="00000000X",
                account_number="ES0000000000000000",
                role=Role.ADMIN
            )
            db.session.add(admin)
            db.session.commit()
            print("✔️ Admin creado")
        else:
            print("ℹ️ Admin ya existe")

# ... (el resto de tu configuración existente)

# Añade esto justo antes del if __name__ == '__main__':
@app.before_request
def _run_before_first_request():
    if not hasattr(app, '_first_request_ran'):
        with app.app_context():
            initialize_admin_user()
        app._first_request_ran = True
    # Puedes añadir más inicializaciones aquí

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
