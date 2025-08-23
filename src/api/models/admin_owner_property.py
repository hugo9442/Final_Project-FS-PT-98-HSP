from sqlalchemy import ForeignKey, UniqueConstraint, Index, Boolean, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db 
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User 

class AdminOwnerProperty(db.Model):
    __tablename__ = "admin_owner_property"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))


    admin: Mapped["User"] = relationship(
        "User",
        foreign_keys=[admin_id],
        back_populates="admins"
    )

    owner: Mapped["User"] = relationship(
        "User",
        foreign_keys=[owner_id],
        back_populates="owners"
    )
    __table_args__ = (
        UniqueConstraint("admin_id", "owner_id", name="uq_admin_owner"),
        Index(
            "ix_one_active_admin_per_owner",
            "owner_id",
            unique=True,
            postgresql_where=text("active = true")
        ),
    )
