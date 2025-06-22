from .database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .apartments import Apartment

class Document (db.Model):
    __tablename__ = 'documents'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    file: Mapped[str] = mapped_column(String(250), nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=False)
    apartment: Mapped['Apartment'] = relationship(
         back_populates='documents')

def serialize(self):
    return{
        "id": self.id,
        "description":self.description,
        "file":self.file,
        "apartament_id":self.apartament_id
    }

def serialize_with_relations(self):
    data=self.serialize()
    data['apartment'] = self.apartment.serialize()
    return data
    