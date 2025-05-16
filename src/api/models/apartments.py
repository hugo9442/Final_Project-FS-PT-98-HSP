from sqlalchemy import Integer, Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .assoc_tenants_apartments_contracts import AssocTenantApartmentContract
    from .issues import Issue

class Apartment(db.Model):
    __tablename__ = 'apartments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    address: Mapped[str] = mapped_column(String(250))
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    stairs: Mapped[str] = mapped_column(Integer, nullable=True)
    floor: Mapped[int] = mapped_column(Integer, nullable=True)
    door: Mapped[str] = mapped_column(Integer, nullable=True)
    postal_code: Mapped[str] = mapped_column(Integer, nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    parking_slot: Mapped[str] = mapped_column(String(50), nullable=False)
    is_rent: Mapped[bool] = mapped_column(Boolean, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    user: Mapped['User'] = relationship('User', back_populates='apartment')
    issues: Mapped['Issue'] = relationship('Issue', back_populates='apartment')
    association: Mapped[List["AssocTenantApartmentContract"]] = relationship('AssocTenantApartmentContract', back_populates='apartment')


    def serialize(self):
        return {
            "apartment_id": self.id,
            "address": self.address,
            "number": self.number,
            "stairs": self.stairs,
            "floor": self.floor,
            "door": self.door,
            "postal_code": self.postal_code,
            "city": self.city,
            "parking_slot": self.parking_slot,
            "is_rent": self.is_rent,
            "owner_id": self.user_id,
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['user'] = self.user.serialize()
        data['issues'] = self.issues.serialize() if self.issues else {}
        return data
