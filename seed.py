from src.database import db
from src.models.users import User, Role
from flask_bcrypt import generate_password_hash
from src.app import app  # asegúrate de importar correctamente

with app.app_context():
    db.create_all()

    # Solo crea el admin si no existe
    if not User.query.filter_by(email="montoria@montoria.es").first():
        admin = User(
            first_name="Admin",
            last_name="General",
            email="montoria@montoria.es",
            password=generate_password_hash("M0nt0r14@2025").decode('utf-8'),
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
