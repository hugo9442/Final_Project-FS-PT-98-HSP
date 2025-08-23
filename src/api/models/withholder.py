from sqlalchemy import Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .expenses import Expense
    from .assoc_tenants_apartments_contracts import AssocTenantApartmentContract
    from .docusing import Docusing 


class Withholding(db.Model):
    __tablename__ = "withholdings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    percentage: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

  
    association: Mapped[List["AssocTenantApartmentContract"]] = relationship('AssocTenantApartmentContract', back_populates="withholdings")
    docusings: Mapped[List["Docusing"]] = relationship('Docusing', back_populates="retencion")

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "percentage": self.percentage
        }