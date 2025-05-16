from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db

class Issue(db.Model):
    __tablename__ = 'issues'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Date] = mapped_column(Date, nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=False)

    # Relaciones
    apartment = relationship('Apartment', back_populates='issues')
    actions = relationship('Action', back_populates='issue')
