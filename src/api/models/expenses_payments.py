from .database import db
from sqlalchemy import Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .expenses import Expense

class ExpensePayment(db.Model):
    __tablename__ = "expense_payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    expense_id: Mapped[int] = mapped_column(ForeignKey("expenses.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    expense: Mapped["Expense"] = relationship("Expense", back_populates="payments")

    def serialize(self):
        return {
            "id": self.id,
            "expense_id": self.expense_id,
            "amount": float(self.amount),
            "payment_date": self.payment_date.strftime("%Y-%m-%d"),
        }
