from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file, Response
from docusign_esign import ApiClient, ApiException, EnvelopesApi, EnvelopeDefinition, Document, Signer, SignHere, Tabs, Recipients
from api.services import authenticate
from flask_cors import CORS
from flask_jwt_extended import jwt_required,get_jwt_identity
from werkzeug.datastructures import FileStorage
from io import BytesIO
import base64
import json
import io
import logging
import requests
from api.models import db, Docusing
import xml.etree.ElementTree as ET
from api.services.tenantcy import create_full_tenancy_flow


docusing_api = Blueprint('docusing_api', __name__, url_prefix='/docusing')




@docusing_api.route("/test_auth", methods=["GET"])
def test_auth():
    try:
        api_client = authenticate()
        return jsonify({"message": "Autenticación exitosa"})
    except Exception as e:
        print("Error autenticando:", str(e))
        return jsonify({"error": str(e)}), 500



@docusing_api.route("/send_contract", methods=["POST"])
@jwt_required()
def send_contract():
    owner_id = request.form.get("owner_id")
    signer_email = request.form.get("tenant_email")
    signer_name = request.form.get("tenant_name")

    # Nuevos campos según la tabla
    tenant_name = request.form.get("tenant_name")
    tenant_email = request.form.get("tenant_email")
    tenant_dni = request.form.get("tenant_dni")
    tenant_phone = request.form.get("tenant_phone")
    account_number = request.form.get("account_number")

    rent_amount = request.form.get("renta")
    iva = request.form.get("iva")
    retencion = request.form.get("retencion")
    start_date = request.form.get("start_date")
    end_date = request.form.get("end_date")

    apartment_id = request.form.get("apartment_id")
    print(request.form)
    if not owner_id:
        return jsonify({"error": "Falta owner_id"}), 400
    if not signer_email or not signer_name:
        return jsonify({"error": "Falta email o nombre"}), 400
    if "contract" not in request.files:
        return jsonify({"error": "No se envió el contrato"}), 400

    contract_file = request.files["contract"]
    document_bytes = contract_file.read()

    api_client = authenticate()
    envelopes_api = EnvelopesApi(api_client)

    document = Document(
        document_base64=base64.b64encode(document_bytes).decode('utf-8'),
        name="Contrato de Alquiler",
        file_extension="pdf",
        document_id="1"
    )

    signer = Signer(
        email=signer_email,
        name=signer_name,
        recipient_id="1",
        routing_order="1"
    )

    sign_here = SignHere(
        document_id="1",
        page_number="1",
        recipient_id="1",
        tab_label="SignHereTab",
        x_position="200",
        y_position="500"
    )

    signer.tabs = Tabs(sign_here_tabs=[sign_here])

    envelope_definition = EnvelopeDefinition(
        email_subject="Firma de contrato de alquiler",
        documents=[document],
        recipients=Recipients(signers=[signer]),
        status="sent"
    )

    account_id = current_app.config["DOCUSIGN_CONFIG"]["ACCOUNT_ID"]

    try:
        envelope_summary = envelopes_api.create_envelope(account_id, envelope_definition=envelope_definition)
        
        # Guardar en la base de datos con todos los campos de la tabla
        docusign_record = Docusing(
            owner_id=owner_id,
            envelope_id=envelope_summary.envelope_id,
            status='sent',
            signer_email=signer_email,
            signer_name=signer_name,
            tenant_name=tenant_name,
            tenant_email=tenant_email,
            tenant_dni=tenant_dni,
            tenant_phone=tenant_phone,
            account_number=account_number,
            rent_amount=float(rent_amount) if rent_amount else None,
            iva_id=iva,
            retencion_id=retencion,
            start_date=start_date if start_date else None,
            end_date=end_date if end_date else None,
            apartment_id=apartment_id if apartment_id else None
        )
        db.session.add(docusign_record)
        db.session.commit()

        return jsonify({"envelope_id": envelope_summary.envelope_id})

    except ApiException as e:
        print(f"DocuSign API Exception: {e.status} - {e.body}")
        return jsonify({"error": f"DocuSign API Error: {e.body.decode('utf-8')}"}), e.status



# Endpoint para consultar el estado de la firma
@docusing_api.route("/envelope_status/<envelope_id>", methods=["GET"])
@jwt_required()
def envelope_status(envelope_id):
    api_client = authenticate()
    envelopes_api = EnvelopesApi(api_client)
    account_id = current_app.config["DOCUSIGN_CONFIG"]["ACCOUNT_ID"]
    envelope = envelopes_api.get_envelope(account_id, envelope_id)

    return jsonify({"status": envelope.status})


@docusing_api.route("/webhook", methods=["POST"])
def docusign_webhook():
    try:
        raw_data = request.data
        with open("docusign_webhook_payload.txt", "ab") as f:
            f.write(raw_data)

        payload = json.loads(raw_data)

        envelope_id = payload.get("data", {}).get("envelopeId")
        status = payload.get("event", {})

        if not envelope_id:
            return jsonify({"error": "No envelopeId"}), 400

        # Guarda o actualiza registro básico según status...
        docusign_record = Docusing.query.filter_by(envelope_id=envelope_id).first()
        if not docusign_record:
            return jsonify({"error": "No se encontró registro Docusing"}), 404

        docusign_record.status = status
        db.session.commit()

        # Si el contrato está completado o firmado, llamamos al endpoint para crear tenant, contrato, etc.
        if status and status.lower() == "envelope-completed":
                        # Extraer PDF base64 del payload
            pdf_base64 = payload["data"]["envelopeSummary"]["envelopeDocuments"][0]["PDFBytes"]

            # Llamada interna al endpoint para procesar
            url = "http://localhost:3001/docusing/send-docusing-contract"  # Cambia el puerto si usas otro
            headers = {"Content-Type": "application/json"}
            json_data = {
                "envelope_id": envelope_id,
                "contract_file_base64": pdf_base64
            }

            response = requests.post(url, json=json_data, headers=headers)
            if response.status_code != 200:
                return jsonify({"error": "Error al procesar contrato"}), 500

        return jsonify({"message": "Webhook procesado correctamente"}), 200

    except Exception as e:
        print(f"Error webhook: {e}")
        return jsonify({"error": "Error interno"}), 500


@docusing_api.route('/send-docusing-contract', methods=['POST'])
def send_docusing_contract():
    

    def base64_to_filestorage(base64_pdf: str, filename: str = "signed_contract.pdf") -> FileStorage:
        try:
            pdf_bytes = base64.b64decode(base64_pdf)
            pdf_stream = BytesIO(pdf_bytes)
            file_storage = FileStorage(stream=pdf_stream, filename=filename, content_type="application/pdf")
            return file_storage
        except Exception as e:
            logging.error(f"Error decodificando base64 a FileStorage: {e}", exc_info=True)
            raise ValueError("Archivo PDF corrupto o base64 inválido")

    try:
        data = request.get_json()
        if not data:
            logging.warning("No se recibió JSON en la petición")
            return jsonify({"success": False, "error": "No se recibió JSON en la petición"}), 400

        envelope_id = data.get("envelope_id")
        contract_file_base64 = data.get("contract_file_base64")

        if not envelope_id or not contract_file_base64:
            logging.warning("Faltan datos obligatorios: 'envelope_id' o 'contract_file_base64'")
            return jsonify({"success": False, "error": "Faltan 'envelope_id' o 'contract_file_base64'"}), 400

        contract_file = base64_to_filestorage(contract_file_base64)

        result = create_full_tenancy_flow(envelope_id, contract_file)

        logging.info(f"Contrato procesado correctamente para envelope_id {envelope_id}")

        return jsonify({
            "success": True,
            "message": "Contrato enviado y procesado correctamente",
            "result": result
        }), 200

    except Exception as e:
        logging.error(f"Error en send_docusing_contract: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@docusing_api.route("/download_signed_document/<envelope_id>", methods=["GET"])
@jwt_required()  # Si quieres restringir acceso autenticado
def download_signed_document(envelope_id):
    docusign_record = Docusing.query.filter_by(envelope_id=envelope_id).first()

    if not docusign_record:
        return jsonify({"error": "No se encontró el documento con ese envelope_id"}), 404

    if not docusign_record.signed_document:
        return jsonify({"error": "El documento aún no ha sido firmado"}), 400

    # Enviar el documento como archivo PDF descargable
    return send_file(
        io.BytesIO(docusign_record.signed_document),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"signed_contract_{envelope_id}.pdf"
    )