from .database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .apartments import Apartment
    from .contractor import Contractor
    from .actions import Action
    from .expenses import Expense

class Document (db.Model):
    __tablename__ = 'documents'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(String(255), nullable=False)

    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id"), nullable=False)
    action_id: Mapped[int] = mapped_column(ForeignKey("actions.id"), nullable=True)
    contractor_id: Mapped[int] = mapped_column(ForeignKey("contractors.id"), nullable=True)

    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="documents")
    action: Mapped["Action"] = relationship("Action", back_populates="documents")
    contractor: Mapped["Contractor"] = relationship("Contractor", back_populates="documents")
    expenses: Mapped[List["Expense"]] = relationship("Expense", back_populates="document")

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "file_url": self.file_url,
            "apartment_id": self.apartment_id,
            "action_id": self.action_id,
            "contractor_id": self.contractor_id
        }
    
    def serialize_with_relations(self):
     data=self.serialize()
     data['apartment'] = self.apartment.serialize()
    
     return data
    