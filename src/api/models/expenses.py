from .database import db
from sqlalchemy import Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .apartments import Apartment
    from .documents import Document
    from .contractor import Contractor
    from .expenses_category import ExpenseCategory
    from .actions import Action
    from.expenses_payments import ExpensePayment
  

class Expense(db.Model):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    received_invoices: Mapped[float] = mapped_column(Numeric(10,2), nullable=True, default=0.0)
    payed_invoices: Mapped[float] = mapped_column(Numeric(10,2), nullable=True, default=0.0)

    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=False)
    contractor_id: Mapped[int] = mapped_column(ForeignKey('contractors.id'), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey('expense_categories.id'), nullable=False)
    document_id: Mapped[int] = mapped_column(ForeignKey('documents.id'), nullable=True)
    action_id: Mapped[int] = mapped_column(ForeignKey("actions.id"), nullable=True)

    action: Mapped["Action"] = relationship("Action", back_populates="expenses")
    document: Mapped["Document"] = relationship("Document", back_populates="expenses")
    apartment: Mapped["Apartment"] = relationship("Apartment", back_populates="expenses")
    contractor: Mapped["Contractor"] = relationship("Contractor", back_populates="expenses")
    category: Mapped["ExpenseCategory"] = relationship("ExpenseCategory", back_populates="expenses")
    payments: Mapped[List["ExpensePayment"]] = relationship("ExpensePayment", back_populates="expense", cascade="all, delete")

  
   

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "date": self.date.strftime("%Y-%m-%d"),
            "received_invoices": float(self.received_invoices),
            "payed_invoices": float(self.payed_invoices),
            "balance": float(self.payed_invoices - self.received_invoices),
            
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['apartment'] = self.apartment.serialize() if self.apartment else None
        data['contractor'] = self.contractor.serialize() if self.contractor else None
        data['category'] = self.category.serialize() if self.category else None
        data['document'] = self.document.serialize() if self.document else None
        data['action'] = self.action.serialize() if self.action else None
        data['payments']= [payment.serialize() for payment in self.payments]
        return data
    def serialize_expenses(self):
        data=self.rerialize()
        data['payments']= [payment.serialize() for payment in self.payments]
        return data
