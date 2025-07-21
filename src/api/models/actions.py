from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime,ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .database import db
from typing import TYPE_CHECKING, List


if TYPE_CHECKING:
    from .issues import Issue
    from .contractor import Contractor
    from .documents import Document
    from .expenses import Expense

class Action(db.Model):
    __tablename__ = 'actions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
   
    action_name: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[str] = mapped_column(String(350), nullable=False)
    contractor_id:Mapped[int] = mapped_column(ForeignKey('contractors.id'), nullable=True)
    issue_id: Mapped[int] = mapped_column(ForeignKey('issues.id'), nullable=False)
    expenses: Mapped[List["Expense"]] = relationship("Expense", back_populates="action")
    issue: Mapped ['Issue'] = relationship(
         back_populates='actions'
    )
    contractor: Mapped ['Contractor'] = relationship("Contractor",
         back_populates='actions'
    )
    documents: Mapped [List['Document']] = relationship('Document',
         back_populates='action'
    )

    def serialize(self):
        return {
        "action_id": self.id,
        "issue_id": self.issue_id,
        "action_name": self.action_name,
        "start_date": self.start_date,
        "description": self.description,
        "contractor": self.contractor.serialize() if self.contractor else None,
        "documents": [doc.serialize() for doc in self.documents] if self.documents else [],
        "expenses": [exp.serialize() for exp in self.expenses] if self.expenses else []
    }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['issue'] = self.issue.serialize() if self.issue else None
        data['contractor'] = self.contractor.serialize() if self.contractor else None
        return data
