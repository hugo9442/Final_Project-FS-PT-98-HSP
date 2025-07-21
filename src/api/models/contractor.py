from .database import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .actions import Action
    from .expenses import Expense
    from .documents import Document

class Contractor(db.Model):
    __tablename__ = "contractors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    nif: Mapped[str] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(255), nullable=True)
    name_contact: Mapped[str] = mapped_column(String(255), nullable=True)
    notes: Mapped[str] = mapped_column(String(255), nullable=True)

    actions: Mapped[List["Action"]] = relationship(
        "Action", back_populates="contractor"
    )
    expenses: Mapped[List["Expense"]] = relationship(
        "Expense", back_populates="contractor"
    )
    documents: Mapped[List["Document"]] = relationship('Document', back_populates="contractor")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "nif": self.nif,
            "email": self.email,
            "phone": self.phone,
            "name_contact": self.name_contact,
            "notes": self.notes
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['expenses'] = [expense.serialize() for expense in self.expenses]
        data['actions'] = [action.serialize() for action in self.actions]
        return data
