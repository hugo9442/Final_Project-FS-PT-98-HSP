from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file
from api.models import db, Document
from api.models.users import Role
from sqlalchemy.orm import joinedload
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import boto3
from botocore.client import Config
from io import BytesIO
from botocore.exceptions import ClientError

documents_api = Blueprint('documents_api', __name__, url_prefix='/documents')

CORS(documents_api)

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=os.getenv("R2_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"), 
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )

@documents_api.route('/', methods=['GET'])
@jwt_required()
def get_documents():
    try:
        documents = Document.query.all()
        return jsonify({
            "msg": "ok",
            "documents": [document.serialize_with_relations() for document in documents]
        }), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500




@documents_api.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file part"}), 400
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Solo se permiten archivos PDF"}), 400

    description = request.form.get('description')
    apartment_id = request.form.get('apartment_id')
    if not description or not apartment_id:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    original_name = secure_filename(file.filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{original_name.rsplit('.', 1)[0]}_{timestamp}.pdf"

    try:
        # Validar tamaño del archivo
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        if file_size == 0:
            raise ValueError("El archivo está vacío")

        # Subida a R2
        s3 = get_r2_client()
        s3.upload_fileobj(
            file,
            os.getenv("R2_BUCKET_NAME"),
            unique_filename,
            ExtraArgs={
                'ContentType': 'application/pdf',
                'ACL': 'private'
            }
        )

        file_url = f"{os.getenv('R2_PUBLIC_URL')}/{unique_filename}"

        # Guardar en base de datos
        new_doc = Document(
            description=description,
            file=file_url,
            apartment_id=apartment_id
        )

        db.session.add(new_doc)
        db.session.commit()

        return jsonify({
            "msg": "Documento subido con éxito",
            "document": new_doc.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al procesar el archivo", "details": str(e)}), 500


@documents_api.route('/download/<int:document_id>', methods=['GET'])
@jwt_required()
def download_document(document_id):
    try:
      
        document = Document.query.get_or_404(document_id)
        
        filename = document.file.split('/')[-1]
        
        s3 = get_r2_client()
        
        file_stream = BytesIO()
        s3.download_fileobj(
            os.getenv("R2_BUCKET_NAME"),
            filename,
            file_stream
        )
        file_stream.seek(0) 
        
        
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return jsonify({"error": "Archivo no encontrado en R2"}), 404
        return jsonify({"error": f"Error de AWS: {str(e)}"}), 500
        
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500