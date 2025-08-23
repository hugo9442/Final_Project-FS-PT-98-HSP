from .database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, ForeignKey, DateTime, func, LargeBinary, Float, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .users import User
    from .apartments import Apartment
    from .taxtype import TaxType
    from .withholder import Withholding
    
class Docusing(db.Model):
    __tablename__ = 'docusings'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Usuario propietario
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # Información de DocuSign
    envelope_id: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    signed_document: Mapped[bytes] = mapped_column(LargeBinary, nullable=True)

    # Firmante
    signer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    signer_email: Mapped[str] = mapped_column(String(255), nullable=False)

    # Datos del inquilino a registrar
    tenant_name: Mapped[str] = mapped_column(String(255), nullable=True)
    tenant_email: Mapped[str] = mapped_column(String(255), nullable=True)
    tenant_dni: Mapped[str] = mapped_column(String(50), nullable=True)
    tenant_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    account_number: Mapped[str] = mapped_column(String(255), nullable=True)

    # Información del contrato
    rent_amount: Mapped[float] = mapped_column(Float, nullable=True)

    # Claves foráneas a tablas IVA y Retención
    iva_id: Mapped[int] = mapped_column(ForeignKey("tax_types.id"), nullable=True)
    retencion_id: Mapped[int] = mapped_column(ForeignKey("withholdings.id"), nullable=True)

    start_date: Mapped[datetime] = mapped_column(Date, nullable=True)
    end_date: Mapped[datetime] = mapped_column(Date, nullable=True)

    # Vivienda asociada (opcional)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id"), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now(), server_default=func.now())

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="docusings")
    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="docusings")

    iva: Mapped["TaxType"] = relationship("TaxType", back_populates="docusings")
    retencion: Mapped["Withholding"] = relationship("Withholding", back_populates="docusings")

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "envelope_id": self.envelope_id,
            "status": self.status,
            "signer_email": self.signer_email,
            "signer_name": self.signer_name,
            "iva_id": self.iva_id,
            "retencion_id": self.retencion_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['user'] = self.user.serialize() if self.user else None
        data['iva'] = {
            "id": self.iva.id,
            "name": self.iva.name,
            "percentage": float(self.iva.percentage)
        } if self.iva else None
        data['retencion'] = {
            "id": self.retencion.id,
            "name": self.retencion.name,
            "percentage": float(self.retencion.percentage)
        } if self.retencion else None
        return data