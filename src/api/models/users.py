
from .database import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum
from typing import List, TYPE_CHECKING
from enum import Enum as PyEnum

class Role(PyEnum):
    PROPIETARIO = 'PROPIETARIO'
    INQUILINO = 'INQUILINO'
    ADMIN = 'ADMIN'

role_type = Enum(
    Role, 
    name="role_type_enum",
    create_type=True, 
    validate_strings=True
)

if TYPE_CHECKING:
    from .contracts import Contract
    from . apartments import Apartment
    from .assoc_tenants_apartments_contracts import  AssocTenantApartmentContract
    from .invoice import Invoice
class User(db.Model):
    __tablename__= "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255),nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    national_id: Mapped[str] = mapped_column(String(255), nullable=False)
    account_number: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(role_type, nullable=False)
    apartments: Mapped[List["Apartment"]] = relationship(
        back_populates="owner"
    )
    contracts: Mapped[List["Contract"]] = relationship(
        back_populates="owner"
    )
    association:Mapped[List["AssocTenantApartmentContract"]] = relationship(
        back_populates="tenant"
    )
    invoices_as_tenant: Mapped[list['Invoice']] = relationship(
        back_populates="tenant",
        foreign_keys="Invoice.tenant_id",
        cascade="all, delete-orphan"
    )
    invoices_as_owner: Mapped[list['Invoice']] = relationship(
        back_populates="owner",
        foreign_keys="Invoice.owner_id",
        cascade="all, delete-orphan"
    )


    def serialize(self):
        return {
            "id":self.id,
            "first_name": self.first_name, 
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "national_id": self.national_id,
            "account_number": self.account_number,
            "role": self.role.value
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['apartment'] = [apartment.serialize() for apartment in self.apartments] if self.apartments else []
        data['contract'] = [contract.serialize() for contract in self.contracts] if self.contracts else []
        data['association'] = [association.serialize() for association in self.association] if self.association else []
        data['invoices_as_tenant'] = [inv.serialize() for inv in self.invoices_as_tenant]
        data['invoices_as_owner'] = [inv.serialize() for inv in self.invoices_as_owner]
        return data
    
    def serialize_invoices_only(self):
        return {
        "id": self.id,
        "first_name": self.first_name,
        "last_name": self.last_name,
        "national_id":self.national_id,
        "invoices_as_tenant": [inv.serialize() for inv in self.invoices_as_tenant],
       
    }