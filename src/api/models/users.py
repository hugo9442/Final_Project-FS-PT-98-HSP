
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
    SUPERVISOR = 'SUPERVISOR'

role_type = Enum(
    Role, 
    name="role_type_enum",
    create_type=True, 
    validate_strings=True
)

if TYPE_CHECKING:
    from .contracts import Contract
    from .apartments import Apartment
    from .assoc_tenants_apartments_contracts import  AssocTenantApartmentContract
    from .invoice import Invoice
    from .docusing import Docusing
    from .admin_owner_property import AdminOwnerProperty
    from .stripe import Subscription    
    

class User(db.Model):
    __tablename__= "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    password: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    national_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=True) 
    account_number: Mapped[str] = mapped_column(String(255), nullable=True)
    role: Mapped[Role] = mapped_column(role_type, nullable=True)
    apartments: Mapped[List["Apartment"]] = relationship(
        back_populates="owner"
    )
    contracts: Mapped[List["Contract"]] = relationship(
        back_populates="owner"
    )
    docusings: Mapped[List["Docusing"]] = relationship(
        "Docusing", back_populates="user", cascade="all, delete-orphan"
    )
    association:Mapped[List["AssocTenantApartmentContract"]] = relationship(
        back_populates="tenant"
    )
    invoices_as_tenant: Mapped[List['Invoice']] = relationship(
        back_populates="tenant",
        foreign_keys="Invoice.tenant_id",
        cascade="all, delete-orphan"
    )
    invoices_as_owner: Mapped[List['Invoice']] = relationship(
        back_populates="owner",
        foreign_keys="Invoice.owner_id",
        cascade="all, delete-orphan"
    )
    owners: Mapped[List["AdminOwnerProperty"]] = relationship(
       "AdminOwnerProperty",
        back_populates="owner",
        foreign_keys="AdminOwnerProperty.owner_id",
        cascade="all, delete-orphan"
    )
    admins: Mapped[list["AdminOwnerProperty"]] = relationship(
       "AdminOwnerProperty",
        back_populates="admin",
        foreign_keys="AdminOwnerProperty.admin_id",
        cascade="all, delete-orphan"
    )    
    subscription: Mapped[List["Subscription"]] = relationship(
        "Subscription", back_populates="user", cascade="all, delete-orphan"
    )



    def serialize(self):
     result = {}
     for key in ["id", "first_name", "last_name", "email", "phone", "national_id", "account_number", "role", "status"]:
        value = getattr(self, key)
        if isinstance(value, bytes):
            value = value.decode("utf-8")
        elif key == "role" and value is not None:
            value = value.value if hasattr(value, "value") else str(value)
        result[key] = value
     return result
    
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