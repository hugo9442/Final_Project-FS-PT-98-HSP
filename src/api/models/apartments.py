from sqlalchemy import Integer, Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .assoc_tenants_apartments_contracts import AssocTenantApartmentContract
    from .issues import Issue
    from .documents import Document

class Apartment(db.Model):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    address: Mapped[str] = mapped_column(String(255),nullable=False)
    postal_code: Mapped[str] = mapped_column(String(30), nullable=False)
    city: Mapped[str] = mapped_column(String(255), nullable=False)
    parking_slot: Mapped[str] = mapped_column(String(255), nullable=False)
    is_rent: Mapped[bool] = mapped_column(Boolean, nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    owner: Mapped['User'] = relationship(
        back_populates='apartments'
    )
    issues: Mapped[List['Issue']] = relationship(
        back_populates='apartment'
    )
    association: Mapped[List["AssocTenantApartmentContract"]] = relationship(
         back_populates='apartment'
    )
    documents:Mapped[List['Document']] = relationship(
        back_populates='apartment'
    )


    def serialize(self):
        return {
            "id": self.id,
            "address": self.address,
            "postal_code": self.postal_code,
            "city": self.city,
            "parking_slot": self.parking_slot,
            "is_rent": self.is_rent,
            "owner_id": self.owner_id,
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['owner'] = self.owner.serialize() if self.owner else None
        data['issues'] = [issue.serialize() for issue in self.issues]
        data['contracts'] = [assoc.serialize() for assoc in self.association]
        data['documents'] = [document.serialize() for document in self.documents]
        return data
    def serialize_with_owner_name(self):
        data = self.serialize()
        if self.owner:
         data["owner_name"] = f"{self.owner.first_name} {self.owner.last_name}"
        else:
         data["owner_name"] = None
        return data