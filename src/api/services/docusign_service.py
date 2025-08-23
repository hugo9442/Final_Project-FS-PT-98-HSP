from flask import current_app
from docusign_esign import ApiClient, ApiException
from datetime import datetime, timedelta
import re
import logging
import socket
import urllib3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Desactivar warnings de urllib3 (opcional)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

token_cache = {
    "token": None,
    "expires_at": None
}

def check_dns_resolution(hostname):
    """Verifica si el DNS puede resolver el hostname de DocuSign"""
    try:
        socket.gethostbyname(hostname)
        return True
    except socket.error as e:
        logger.error(f"Error de DNS: No se pudo resolver {hostname} - {str(e)}")
        return False

def authenticate():
    config = current_app.config["DOCUSIGN_CONFIG"]
    
    # Configuración de entorno
    is_demo = "demo.docusign.net" in config["BASE_PATH"].lower()
    oauth_host = "account-d.docusign.com" if is_demo else "account.docusign.com"
    
    api_client = ApiClient()
    api_client.set_oauth_host_name(oauth_host)  # ¡Configuración crítica!

    try:
        # Leer clave privada
        with open(config["PRIVATE_KEY_PATH"], "r") as key_file:
            private_key = key_file.read()

        # Obtener token JWT
        response = api_client.request_jwt_user_token(
            client_id=config["INTEGRATION_KEY"],
            user_id=config["USER_ID"],
            oauth_host_name=oauth_host,
            private_key_bytes=private_key.encode("ascii"),
            expires_in=3600,
            scopes=["signature"]
        )

        # Configurar el cliente para llamadas posteriores
        api_client.host = config["BASE_PATH"]
        api_client.set_default_header("Authorization", f"Bearer {response.access_token}")

        # Obtener información del usuario (CONFIGURACIÓN ADICIONAL REQUERIDA)
        api_client.set_oauth_host_name(oauth_host)  # Necesario para get_user_info
        user_info = api_client.get_user_info(response.access_token)
        
        logger.info(f"Autenticado como: {user_info.sub}")
        return api_client

    except Exception as e:
        logger.error(f"Error de autenticación: {str(e)}")
        raise Exception(f"No se pudo autenticar con DocuSign: {str(e)}")