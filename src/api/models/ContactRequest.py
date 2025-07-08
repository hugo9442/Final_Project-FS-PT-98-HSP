from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime,ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .database import db



class ContactRequest(db.Model):
    __tablename__ = "email"
    id: Mapped[int]=mapped_column(Integer, primary_key=True)
    name: Mapped[str]=mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    message: Mapped[str]= mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def serialize(self):
        return{
            "id":self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "created-at": self.message
        }