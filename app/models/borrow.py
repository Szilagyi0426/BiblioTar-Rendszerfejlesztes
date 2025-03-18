from sqlalchemy import Column, Integer, DateTime, SmallInteger, ForeignKey
from app.database import Base

class Borrow(Base):
    __tablename__ = "borrowes"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    reservationId = Column(Integer, ForeignKey("reservations.id"))
    bookId = Column(Integer, ForeignKey("books.id"))
    startOfRental = Column(DateTime)
    endOfRental = Column(DateTime)
    noOfExtendedRental = Column(SmallInteger)