from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .database import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import  User
    from .assoc_tenants_apartments_contracts import AssocTenantApartmentContract

class Invoice(db.Model):
     __tablename__ = "invoices"

            
     id: Mapped[int] = mapped_column(Integer, primary_key=True)
     status: Mapped[str] = mapped_column(String(255), nullable=False)
     date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
     description: Mapped[str] = mapped_column(String(350), nullable=False)
     bill_amount: Mapped[float] = mapped_column(Float, nullable=False)
     association_id: Mapped[int] = mapped_column(ForeignKey('assoc_tenants_apartments_contracts.id'), nullable=False)
     tenant_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
     association: Mapped['AssocTenantApartmentContract'] = relationship(
        back_populates='invoices'
        )
     user_tenant: Mapped['User'] = relationship(
        back_populates='invoices'
        )

     def serialize(self):
         return{
         "invoce.id": self.id,
         "staus": self.status,
         "date": self.date,
         "description": self.description,
         "bill_amount": self.bill_amount,
         "tenant_id": self.tenant_id

         }
         
        
         
