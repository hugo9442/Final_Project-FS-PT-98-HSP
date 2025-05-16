from sqlalchemy import Integer, String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db

class Action(db.Model):
    __tablename__ = 'actions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    issue_id: Mapped[int] = mapped_column(ForeignKey('issues.id'), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    action_name: Mapped[str] = mapped_column(String(250), nullable=False)
    start_date: Mapped[Date] = mapped_column(Date, nullable=False)
    description: Mapped[str] = mapped_column(String(350), nullable=False)
    contractor: Mapped[str] = mapped_column(String(150), nullable=False)
    bill_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    bill_image: Mapped[str] = mapped_column(String(50), nullable=False)

    issue = relationship('Issue', back_populates='actions')
