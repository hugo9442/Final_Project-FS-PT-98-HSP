from .database import db
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer,DateTime, ForeignKey
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .apartmnets import Apartment

class Contract(db.Model):
    __tablename__="contracts"
    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[datetime] = mapped_column(DateTime)
    end_day: Mapped[datetime] = mapped_column(DateTime)
    document: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    user: Mapped['User'] = relationship(
        back_populates="contract"
    )    
    asociation:Mapped[List["AssocTenantApartmentContract"]] = relationship(
        back_populates="contract"
    )
   