

from api.models import User
import os
import uuid
from flask import render_template, current_app
from flask_jwt_extended import create_access_token
from datetime import timedelta
from api.extensions import mail
from flask_mail import Message
import logging
import traceback


def send_tenant_invitation_email(tenant_id):
    """
    Envía un email al inquilino para que configure su contraseña y acceda a su área privada.
    """
    try:
        tenant = User.query.get(tenant_id)
        if not tenant:
            return {"error": "Inquilino no encontrado"}, 404
        if not tenant.email or "@" not in tenant.email:
         return {"error": "El inquilino no tiene un email válido"}, 400

        claims = {"setup_password": True, "email": tenant.email}

        setup_password_token = create_access_token(
            identity=str(tenant.id),
            expires_delta=timedelta(days=30),
            additional_claims=claims
        )

        frontend_url = current_app.config.get("FRONTEND_URL")
        setup_password_link = f"{frontend_url}set-password?token={setup_password_token}"

        html_body = render_template(
            'tenant_welcome_email.html',
            first_name=tenant.first_name,
            setup_password_link=setup_password_link
        )

        test_email_recipient = os.getenv("TEST_MAIL")
        recipients_list = [tenant.email]
        if test_email_recipient and test_email_recipient != tenant.email:
            recipients_list.append(test_email_recipient)

        msg = Message(
            '¡Bienvenido a InmuGestion! Configura tu Contraseña',
            sender=os.getenv("MAIL_USERNAME"),
            recipients=recipients_list,
            html=html_body
        )
        mail.send(msg)  # Descomentar cuando esté en producción

        return {"msg": "Email de invitación enviado correctamente"}, 200

    except Exception as e:
        logging.error(f"Error al enviar invitación: {e}", exc_info=True)
        return {"error": "Error enviando la invitación al inquilino"}, 500
    
def send_owner_notification_email(owner_id, tenant_name, apartment_id):
    """
    Envía un email al propietario notificando que el inquilino ha firmado el contrato.
    """
    try:
        from api.models import User, Apartment

        owner = User.query.get(owner_id)
        apartment = Apartment.query.get(apartment_id) if apartment_id else None

        if not owner:
            return {"error": "Owner no encontrado"}, 404
        owner_name = " ".join(filter(None, [owner.first_name, owner.last_name]))
        # Log para depuración
        print(
            f"[send_owner_notification_email] Enviando notificación a {owner.email} "
            f"(propietario: {owner_name}) sobre la vivienda "
            f"'{apartment.address if apartment else 'desconocida'}' "
            f"firmada por el inquilino {tenant_name}"
        )

        html_body = render_template(
            "owner_tenant_registered.html",
            owner_name=owner_name,
            tenant_name=tenant_name,
            apartment_address=apartment.address if apartment else "su vivienda",
        )

        recipients_list = [owner.email]
        test_email_recipient = os.getenv("TEST_MAIL")
        if test_email_recipient and test_email_recipient != owner.email:
            recipients_list.append(test_email_recipient)

        msg = Message(
            subject="Tu inquilino ha firmado el contrato",
            sender=os.getenv("MAIL_USERNAME"),
            recipients=recipients_list,
            html=html_body
        )

        mail.send(msg)

        return {"msg": "Email de notificación enviado al owner"}, 200

    except Exception as e:
        print(f"Error enviando email al owner: {e}")
        return {"error": "Error enviando email al owner"}, 500