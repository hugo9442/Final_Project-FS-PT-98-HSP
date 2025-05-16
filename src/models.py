from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import Integer, String, Boolean, ForeignKey, Date, Text
from typing import List

db = SQLAlchemy()

class Base(DeclarativeBase):
    pass

class Apartment(db.Model):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(nullable=False)
    number: Mapped[int] = mapped_column(nullable=False)
    staris: Mapped[str] = mapped_column(nullable=True)
    floor: Mapped[int] = mapped_column(nullable=True)
    door: Mapped[str] = mapped_column(nullable=True)
    postal_code: Mapped[str] = mapped_column(nullable=True)
    city: Mapped[str] = mapped_column(nullable=True)
    parking_slot: Mapped[str] = mapped_column(nullable=True)
    is_rent: Mapped[bool] = mapped_column(Boolean, default=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("owners.id"), nullable=False)

    issues: Mapped[list["Issue"]] = relationship(back_populates="apartment")

class Issue(db.Model):
    __tablename__ = 'issues'

    id: Mapped[int] = mapped_column(primary_key=True)
    priority: Mapped[int] = mapped_column(nullable=True)
    title: Mapped[str] = mapped_column(nullable=False)
    type: Mapped[str] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    start_date: Mapped[Date] = mapped_column(nullable=True)
    end_date: Mapped[Date] = mapped_column(nullable=True)
    apartment_id: Mapped[int] = mapped_column(ForeignKey("apartments.id"), nullable=False)

    apartment: Mapped["Apartment"] = relationship(back_populates="issues")
    actions: Mapped[list["Action"]] = relationship(back_populates="issue")


class Action(db.Model):
    __tablename__ = 'actions'

    id: Mapped[int] = mapped_column(primary_key=True)
    issue_id: Mapped[int] = mapped_column(ForeignKey("issues.id"), nullable=False)
    status: Mapped[str] = mapped_column(nullable=True)
    action_name: Mapped[str] = mapped_column(nullable=False)
    start_date: Mapped[Date] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    contractor: Mapped[str] = mapped_column(nullable=True)
    bill_amount: Mapped[int] = mapped_column(nullable=True)
    bill_image: Mapped[str] = mapped_column(nullable=True)

    issue: Mapped["Issue"] = relationship(back_populates="actions")
