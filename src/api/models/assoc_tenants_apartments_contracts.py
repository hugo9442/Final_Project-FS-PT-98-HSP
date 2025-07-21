from sqlalchemy import Integer, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .apartments import Apartment
    from .contracts import Contract
    from .invoice import Invoice
    from .taxtype import TaxType
    from .withholder import Withholding

class AssocTenantApartmentContract(db.Model):
    __tablename__ = 'assoc_tenants_apartments_contracts'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=True)
    contract_id: Mapped[int] = mapped_column(ForeignKey('contracts.id'), nullable=False)

    renta: Mapped[float] = mapped_column(Numeric(10,2), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tax_percentage_applied: Mapped[float] = mapped_column(Numeric(5,2), nullable=False, default=0.0)
    withholding_percentage_applied: Mapped[float] = mapped_column(Numeric(5,2), nullable=False, default=0.0)

    tax_type_id: Mapped[int] = mapped_column(ForeignKey('tax_types.id'), nullable=False)
    withholding_id: Mapped[int] = mapped_column(ForeignKey('withholdings.id'), nullable=False)

    tenant: Mapped['User'] = relationship(back_populates='association')
    apartment: Mapped['Apartment'] = relationship(back_populates='association')
    contract: Mapped['Contract'] = relationship(back_populates='association')
    invoices: Mapped[list['Invoice']] = relationship(back_populates='association', cascade="all, delete-orphan")

    taxtype: Mapped['TaxType'] = relationship(back_populates='association')
    withholdings: Mapped['Withholding'] = relationship(back_populates='association')

    def serialize(self):
        return {
            "id": self.id,
            "renta": float(self.renta),
            "is_active": self.is_active,
            "taxtype": {
                "id": self.taxtype.id,
                "name": self.taxtype.name,
                "percentage": float(self.taxtype.percentage)
            } if self.taxtype else None,
            "withholdings": {
                "id": self.withholdings.id,
                "name": self.withholdings.name,
                "percentage": float(self.withholdings.percentage)
            } if self.withholdings else None,
            "tenant": self.tenant.serialize() if self.tenant else None,
            "apartment": {
                **self.apartment.serialize(),
                "owner": self.apartment.owner.serialize() if self.apartment and self.apartment.owner else None
            } if self.apartment else None,
            "contract": self.contract.serialize() if self.contract else None,
            "invoices": [invoice.serialize() for invoice in self.invoices] if self.invoices else []
        }
