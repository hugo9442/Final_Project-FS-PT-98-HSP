from sqlalchemy import Integer, Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship, joinedload
from .database import db
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .assoc_tenants_apartments_contracts import AssocTenantApartmentContract
    from .issues import Issue
    from .documents import Document
    from .expenses import Expense
    from .docusing import Docusing

class Apartment(db.Model):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(30), nullable=False)
    city: Mapped[str] = mapped_column(String(255), nullable=False)
    provincia: Mapped[str] = mapped_column(String(255), nullable=True)
    parking_slot: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(255), nullable=False)
    is_rent: Mapped[bool] = mapped_column(Boolean, nullable=False)

    owner_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    owner: Mapped['User'] = relationship(back_populates='apartments')

    issues: Mapped[List['Issue']] = relationship(back_populates='apartment')
    association: Mapped[List["AssocTenantApartmentContract"]] = relationship(back_populates='apartment')
    documents: Mapped[List['Document']] = relationship(back_populates='apartment')
    expenses: Mapped[List["Expense"]] = relationship(back_populates="apartment")
    docusings: Mapped[List["Docusing"]] = relationship(
        "Docusing", back_populates="apartment", cascade="all, delete-orphan"
    )
    
    def serialize(self):
        return {
            "id": self.id,
            "address": self.address,
            "postal_code": self.postal_code,
            "city": self.city,
            "provincia": self.provincia,
            "parking_slot": self.parking_slot,
            "type": self.type,
            "is_rent": self.is_rent,
            "owner_id": self.owner_id,
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['owner'] = self.owner.serialize() if self.owner else None
        data['issues'] = [issue.serialize() for issue in self.issues]
        data['contracts'] = [assoc.serialize() for assoc in self.association]
        data['documents'] = [document.serialize() for document in self.documents]
        data['expenses'] = [expense.serialize() for expense in self.expenses]
        return data

    def serialize_with_owner_name(self):
        has_unpaid_invoices = False
        for assoc in self.association:
            for invoice in assoc.invoices:
                if invoice.status.lower() == "pendiente":
                    has_unpaid_invoices = True
                    break
            if has_unpaid_invoices:
                break

        has_open_issues = any(issue.status.lower() == "abierta" for issue in self.issues)

        return {
            "id": self.id,
            "address": self.address,
            "postal_code": self.postal_code,
            "city": self.city,
            "provincia": self.provincia,
            "parking_slot": self.parking_slot,
            "type": self.type,
            "is_rent": self.is_rent,
            "owner_id": self.owner_id,
            "owner_name": self.owner.first_name if self.owner else None,
            "owner_last_name": self.owner.last_name if self.owner else None,
            "owner_email": self.owner.email if self.owner else None,
            "owner_phone": self.owner.phone if self.owner else None,
            "onwer_national_id": self.owner.national_id if self.owner else None,
            "has_unpaid_invoices": has_unpaid_invoices,
            "has_open_issues": has_open_issues
        }

