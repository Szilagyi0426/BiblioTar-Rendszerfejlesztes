from sqlalchemy import Column, Integer, Enum, DateTime, ForeignKey
from app.database import Base
import enum

class ReservationStatusEnum(str, enum.Enum):
    active = "active"
    cancelled = "cancelled"
    fulfilled = "fulfilled"

 
class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    bookId = Column(Integer, ForeignKey("books.id"))
    reservationDate = Column(DateTime)
    status = Column(Enum(ReservationStatusEnum), default=ReservationStatusEnum.active)