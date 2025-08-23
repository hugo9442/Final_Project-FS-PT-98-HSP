from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from api.models import User, Subscription, db
import os
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY") 
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

subscriptions_bp = Blueprint("subscriptions", __name__, url_prefix="/subscriptions")

@subscriptions_bp.route("/", methods=["GET"])
def get_subscriptions():
    subs = Subscription.query.all()
    return jsonify([sub.serialize() for sub in subs]), 200

@subscriptions_bp.route("/create-subscription", methods=["POST"])
def create_subscription():
    data = request.get_json()
    user_id = data.get("user_id")
    plan_id = data.get("priceId")

    if not user_id or not plan_id:
        return jsonify({"error": "user_id y priceId son obligatorios"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Crear cliente Stripe solo si no existe
    if user.subscription and user.subscription.stripe_customer_id:
        customer_id = user.subscription.stripe_customer_id
    else:
        customer = stripe.Customer.create(email=user.email)
        customer_id = customer.id

    # Crear sesión de checkout con trial de 14 días
    try:
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": plan_id, "quantity": 1}],
            mode="subscription",
            subscription_data={
                "trial_period_days": 14,  # periodo de prueba en Stripe
                "metadata": {"user_id": str(user.id)}  # enlazar con tu sistema
            },
            metadata={"user_id": str(user.id)}, 
            success_url="https://special-couscous-wrpgj9jx4q92v6xw-3000.app.github.dev/propietarioindex?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://special-couscous-wrpgj9jx4q92v6xw-3000.app.github.dev/cancel",
        )
        return jsonify({"checkoutUrl": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@subscriptions_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError:
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError:
        return "Invalid signature", 400

    print("Evento recibido:", event["type"])

    obj = event["data"]["object"]

    # Inicializamos variables
    stripe_sub_id = None
    stripe_customer_id = None
    status = None
    user_id = None

    # Filtramos eventos que afectan a suscripciones
    if event["type"] in ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]:
        stripe_sub_id = obj.get("id")
        stripe_customer_id = obj.get("customer")
        status = obj.get("status")  # trialing, active, past_due, canceled
        metadata = obj.get("metadata", {})
        user_id = metadata.get("user_id")

    elif event["type"] in ["invoice.paid", "invoice.payment_failed", "invoice.upcoming"]:
        # En invoices, obtenemos la suscripción asociada para leer su status real
        stripe_sub_id = obj.get("subscription")
        if stripe_sub_id:
            # Consultamos Stripe para obtener el objeto suscripción completo
            sub_obj = stripe.Subscription.retrieve(stripe_sub_id)
            stripe_customer_id = sub_obj.get("customer")
            status = sub_obj.get("status")
            metadata = sub_obj.get("metadata", {})
            user_id = metadata.get("user_id")

    else:
        # Otros eventos que no nos interesan
        return jsonify({"received": True}), 200

    print("Suscripción ID:", stripe_sub_id)
    print("Customer ID:", stripe_customer_id)
    print("Status:", status)
    print("User ID:", user_id)

    if not stripe_sub_id or not stripe_customer_id or not user_id:
        return jsonify({"received": True}), 200  # no hacemos nada si faltan datos

    # Buscar suscripción en nuestra DB
    sub = Subscription.query.filter(
        (Subscription.stripe_subscription_id == stripe_sub_id) |
        (Subscription.stripe_customer_id == stripe_customer_id)
    ).first()

    user = User.query.get(int(user_id)) if user_id else None

    # Si no existe, la creamos
    if not sub and user:
        sub = Subscription(
            user_id=user.id,
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_sub_id,
            status=status,
            plan=obj.get("plan", {}).get("nickname", "basico"),
            trial_start=datetime.utcfromtimestamp(obj.get("trial_start")) if obj.get("trial_start") else None,
            trial_end=datetime.utcfromtimestamp(obj.get("trial_end")) if obj.get("trial_end") else None,
        )
        db.session.add(sub)
        if user:
            user.status = status
            db.session.add(user)

    # Si existe, actualizamos
    elif sub:
        sub.stripe_subscription_id = stripe_sub_id
        sub.stripe_customer_id = stripe_customer_id
        sub.status = status
        sub.trial_start = datetime.utcfromtimestamp(obj.get("trial_start")) if obj.get("trial_start") else sub.trial_start
        sub.trial_end = datetime.utcfromtimestamp(obj.get("trial_end")) if obj.get("trial_end") else sub.trial_end
        sub.updated_at = datetime.utcnow()
        if sub.user:
            sub.user.status = status
            db.session.add(sub.user)

    db.session.commit()
    return jsonify({"received": True}), 200
