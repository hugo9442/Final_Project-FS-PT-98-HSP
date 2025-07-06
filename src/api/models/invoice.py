from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, ForeignKey, Float, Numeric
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
     bill_amount: Mapped[float] = mapped_column(Numeric(10,2), nullable=False)
     association_id: Mapped[int] = mapped_column(ForeignKey('assoc_tenants_apartments_contracts.id'), nullable=False)
     tenant_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
     owner_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
     association: Mapped['AssocTenantApartmentContract'] = relationship(
        back_populates='invoices'
        )
     tenant: Mapped['User'] = relationship("User", foreign_keys=[tenant_id], back_populates="invoices_as_tenant")
     owner: Mapped['User'] = relationship("User", foreign_keys=[owner_id], back_populates="invoices_as_owner")

  

     def serialize(self):
        return {
            "id": self.id,
            "status": self.status,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "description": self.description,
            "bill_amount": float(self.bill_amount) if self.bill_amount else 0.0,
            "tenant_id": self.tenant_id,
            "owner_id": self.owner_id,
            "tenant": {
                "id": self.tenant.id,
                "first_name": self.tenant.first_name,
                "last_name": self.tenant.last_name,
                "national_id": self.tenant.national_id
            } if self.tenant else None,
           
         }
         
     def serialize_wit_owner(self):
        return {
            "id": self.id,
            "status": self.status,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "description": self.description,
            "bill_amount": float(self.bill_amount) if self.bill_amount else 0.0,
            "tenant_id": self.tenant_id,
            "owner_id": self.owner_id,
            "tenant": {
                "id": self.tenant.id,
                "first_name": self.tenant.first_name,
                "last_name": self.tenant.last_name,
                "national_id": self.tenant.national_id
            } if self.tenant else None,
            "owner": {
                "id": self.owner.id,
                "first_name": self.owner.first_name,
                "last_name": self.owner.last_name,
                "national_id": self.owner.national_id
            } if self.owner else None
        }
         

         
        
         
