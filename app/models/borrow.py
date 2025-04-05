from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from app.database import Base
import app.unixTimeStamp as timestampByMil


class Borrow(Base):
    __tablename__ = "borrows" # Tábla neve

    id = Column(Integer, primary_key=True, index=True) # Azonosító
    userId = Column(Integer, ForeignKey("users.id")) # Felhasználó azonosítója
    reservationId = Column(Integer, ForeignKey("reservations.id")) # Foglalás azonosítója
    bookId = Column(Integer, ForeignKey("books.id")) # Könyv azonosítója
    startOfRental = Column(timestampByMil.UnixTimestampMillis) # Kölcsönzés kezdete
    endOfRental = Column(timestampByMil.UnixTimestampMillis) # Kölcsönzés vége
    noOfExtendedRental = Column(SmallInteger) # Meghosszabbítások száma