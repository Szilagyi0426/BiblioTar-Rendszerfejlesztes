from sqlalchemy import Column, Integer, Enum, ForeignKey
from app.database import Base
import enum
import app.unixTimeStamp as timestampByMil

class ReservationStatusEnum(str, enum.Enum): # A foglalás státuszait tartalmazza
    active = "active"
    cancelled = "cancelled"
    fulfilled = "fulfilled"

 
class Reservation(Base):
    __tablename__ = "reservations" # Tábla neve

    id = Column(Integer, primary_key=True, index=True) # Azonosító
    userId = Column(Integer, ForeignKey("users.id")) # Felhasználó azonosítója
    bookId = Column(Integer, ForeignKey("books.id")) # Könyv azonosítója
    reservationDate = Column(timestampByMil.UnixTimestampMillis) # Foglalás dátuma
    status = Column(Enum(ReservationStatusEnum), default=ReservationStatusEnum.active) # Foglalás státusza