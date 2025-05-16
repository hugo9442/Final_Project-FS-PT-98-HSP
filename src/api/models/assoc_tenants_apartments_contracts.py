from sqlalchemy import Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db

class AssocTenantApartmentContract(db.Model):
    __tablename__ = 'assoc_tenants_apartments_contracts'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=False)
    contract_id: Mapped[int] = mapped_column(ForeignKey('contracts.id'), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    user = relationship('Tenant', back_populates='association')
    apartment = relationship('Apartment', back_populates='association')
    contract = relationship('Contract', back_populates='association')

    
