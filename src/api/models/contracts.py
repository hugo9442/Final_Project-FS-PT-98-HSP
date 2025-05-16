from .database import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer,DateTime, ForeignKey
from typing import List, TYPE_CHECKING

from .owenrs import Owner
from .apartmnets import Apartment

class Contract(db.Model):
    __tablename__="contracts"
    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    end_day: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    document: Mapped[str] = mapped_column(String(255), nullable=False)
    owend_id: Mapped[int] = mapped_column(ForeignKey("owners.id"), nullable=True)
    owner: Mapped['Owner'] = relationship(
        back_populates="contract",
    )
    tenant:Mapped[List["Apartment"]] = relationship(
        back_populates="contract"
        secondary=Assoc_Tenants_apartments_contracts
    )