from flask import request, jsonify, Blueprint,current_app
from api.models import db, Issue
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from api.extensions import mail
from sqlalchemy import func


issues_api = Blueprint('issues_api', __name__, url_prefix='/issues')

CORS(issues_api)

@issues_api.route('/', methods=["GET"])
@jwt_required()
def get_all_issues():
    issues = Issue.query.all()
    return jsonify({"msg":"ok", "issues":[issue.serialize() for issue in issues]}), 200

@issues_api.route('/opened', methods=["GET"])
@jwt_required()
def get_opened_issues():
    opened = opened = db.session.query(func.count(Issue.id))\
                   .filter(Issue.status == "ABIERTA")\
                   .scalar()
    return jsonify({"msg":"ok", "total":opened}), 200

@issues_api.route('/<int:issue_id>', methods=["GET"])
@jwt_required()
def get_issue(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404
    return jsonify(issue.serialize()), 200

@issues_api.route('/<int:apartment_id>', methods=["GET"])
@jwt_required()
def get_issue_by_apartment(apartment_id):
    issues = Issue.query.filter_by(apartment_id=apartment_id).all()
    if not issues:
        return jsonify({"error": "Issue not found"}), 404
    serialized_issues = [issue.serialize() for issue in issues]
    return jsonify({"incidents": serialized_issues}), 200

@issues_api.route('/<int:issue_id>', methods=["PUT"])
@jwt_required()
def update_issue(issue_id):
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    data_request = request.get_json()

    issue.title = data_request.get("title", issue.title)
    issue.description = data_request.get("description", issue.description)
    issue.status = data_request.get("status", issue.status)

    try:
        db.session.commit()
        return jsonify({"msg": "Issue updated", "issue": issue.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500
    
@issues_api.route('/create', methods=["POST"]) 
@jwt_required()
def create_issue():
    data_request = request.get_json()

    if not data_request.get("title") or not data_request.get("description"):
        return jsonify({"error": "The fields: title and description are required"}), 400

    try:
        start_date = datetime.fromisoformat(data_request["start_date"])
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid or missing start_date"}), 400

    end_date = None
    if "end_date" in data_request and data_request["end_date"]:
        try:
            end_date = datetime.fromisoformat(data_request["end_date"])
        except ValueError:
            return jsonify({"error": "Invalid end_date format"}), 400

    new_issue = Issue(
        title=data_request["title"],
        description=data_request["description"],
        status=data_request.get("status", "open"),
        apartment_id=data_request.get("apartment_id"),
        priority=data_request.get("priority", 1),
        type=data_request.get("type", "general"),
        start_date=start_date,
        end_date=end_date
    )

    try:
        db.session.add(new_issue)
        db.session.commit()
        return jsonify({"msg": "Incidencia Creada", "incidencia": new_issue.serialize()}), 201
    except Exception as e:
        import traceback
        print("Error creating issue:", traceback.format_exc())
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500


@issues_api.route('/<int:issue_id>', methods=["DELETE"])
@jwt_required()
def delete_issue(issue_id):
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    try:
        db.session.delete(issue)
        db.session.commit()
        return jsonify({"msg": "Issue deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500

@issues_api.route('/<int:issue_id>/actions', methods=["GET"])
@jwt_required()
def get_issue_actions(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"error": "Issue not found"}), 404

    actions = issue.actions
    if not actions:
        return jsonify({"error": "No actions for this issue"}), 404

    return jsonify([action.serialize() for action in actions]), 200

@issues_api.route('/<int:issue_id>/close', methods=["PUT"])
@jwt_required()
def close_issue(issue_id):
    issue = Issue.query.get(issue_id)

    if not issue:
        return jsonify({"error": "Incidencia no encontrada"}), 404

    if issue.status.lower() == "cerrado":
        return jsonify({"msg": "La incidencia ya está cerrada"}), 200

    try:
        issue.status = "cerrado"  # o "closed" si usas inglés
        issue.end_date = datetime.now(timezone.utc).date()
        db.session.commit()
        return jsonify({"msg": "Incidencia actualizada a cerrada", "issue": issue.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar incidencia:", e)
        return jsonify({"error": "Error en el servidor"}), 500





@issues_api.route('/create_bytenant', methods=["POST"])
@jwt_required()
def create_issue_by_tenant():
    data_request = request.get_json()

    if not data_request.get("title") or not data_request.get("description"):
        return jsonify({"error": "The fields: title and description are required"}), 400

    try:
        start_date = datetime.fromisoformat(data_request["start_date"])
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid or missing start_date"}), 400

    end_date = None
    if "end_date" in data_request and data_request["end_date"]:
        try:
            end_date = datetime.fromisoformat(data_request["end_date"])
        except ValueError:
            return jsonify({"error": "Invalid end_date format"}), 400

    new_issue = Issue(
        title=data_request["title"],
        description=data_request["description"],
        status=data_request.get("status", "open"),
        apartment_id=data_request.get("apartment_id"),
        priority=data_request.get("priority", 1),
        type=data_request.get("type", "general"),
        start_date=start_date,
        end_date=end_date
    )

    try:
        db.session.add(new_issue)
        db.session.commit()

        # Enviar email tras la creación
        send_issue_notification_email(new_issue, data_request)
       
        return jsonify({"msg": "Incidencia Creada", "incidencia": new_issue.serialize()}), 201

    except Exception as e:
        import traceback
        print("Error creating issue:", traceback.format_exc())
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500


from email.message import EmailMessage
from email import policy

def send_issue_notification_email(issue, data_request):
    print("▶ Entrando en send_issue_notification_email()")

    smtp_host = current_app.config.get("MAIL_SERVER")
    smtp_port = current_app.config.get("MAIL_PORT")
    smtp_user = current_app.config.get("MAIL_USERNAME")
    smtp_pass = current_app.config.get("MAIL_PASSWORD")
    from_email = current_app.config.get("MAIL_DEFAULT_SENDER")
    to_email = from_email

    print("✔ SMTP configurado con:")
    print("  Host:", smtp_host)
    print("  Port:", smtp_port)
    print("  User:", smtp_user)
    print("  From:", from_email)
    print("  To:", to_email)

    if not all([smtp_host, smtp_port, smtp_user, smtp_pass, from_email]):
        print("❌ Configuración SMTP incompleta. Email no enviado.")
        return

    tenant_name = data_request.get("tenant_name", "Nombre Inquilino")
    address = data_request.get("address", "Dirección desconocida")

    subject = f"Inquilino {tenant_name} ha creado la incidencia #{issue.id}"

    html_body = f"""
    <html>
    <body>
        <h2>Notificación de nueva incidencia</h2>
        <p>El inquilino <strong>{tenant_name}</strong> ha creado una nueva incidencia con número 
        <strong>{issue.id}</strong> que requiere atención.</p>
        <p><strong>Dirección:</strong> {address}</p>
        <p><strong>Título:</strong> {issue.title}</p>
        <p><strong>Descripción:</strong> {issue.description}</p>
    </body>
    </html>
    """

    # Usar EmailMessage moderno con policy SMTP (UTF-8 safe)
    msg = EmailMessage(policy=policy.SMTP)
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    msg.set_content("Este correo requiere un cliente compatible con HTML.")
    msg.add_alternative(html_body, subtype="html")

    try:
        print("🚀 Conectando al servidor SMTP...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            if current_app.config.get("MAIL_USE_TLS"):
                print("🔒 Iniciando STARTTLS...")
                server.starttls()
            print("🔑 Haciendo login SMTP...")
            server.login(smtp_user, smtp_pass)
            print("📨 Enviando email...")
            server.send_message(msg)
        print("✅ Email enviado correctamente.")
    except Exception as e:
        print(f"❌ Error enviando email: {e}")
