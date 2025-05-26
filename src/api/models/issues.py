from .database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .apartments import Apartment
    from .actions import Action

class Issue(db.Model):
    __tablename__ = 'issues'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    type: Mapped[str] = mapped_column(String(250), nullable=False)
    status: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=False)
    apartment: Mapped['Apartment'] = relationship(
         back_populates='issues')
    actions: Mapped['Action'] = relationship(
         back_populates='issue'
         )

    def serialize(self):
        return {
            "issue_id": self.id,
            "priority": self.priority,
            "title": self.title,
            "type": self.type,
            "status": self.status,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "apartment_id": self.apartment_id
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['apartment'] = self.apartment.serialize()
        data['action'] = self.actions.serialize() if self.actions else {}
        return data
