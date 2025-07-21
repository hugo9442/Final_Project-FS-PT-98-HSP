from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime,ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .database import db
from typing import TYPE_CHECKING, List


if TYPE_CHECKING:

    from .expenses import Expense
  



class ExpenseCategory(db.Model):
    __tablename__ = "expense_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # ej: "IBI", "Basuras", "Reparación"
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    
    expenses: Mapped[List["Expense"]] = relationship('Expense', back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }
    def serialize_with_relations(self):
        data = self.serialize()
        data['expenses'] = [expense.serialize() for expense in self.expenses]
        return data