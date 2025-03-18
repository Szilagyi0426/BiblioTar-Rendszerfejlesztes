from sqlalchemy import Column, Integer, String, Enum, DateTime
from app.database import Base
import enum

class BorrowStatusEnum(str, enum.Enum):
    borrowed = "borrowed"
    available = "available"
    lost = "lost"
    damaged = "damaged"

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    borrowStatus = Column(Enum(BorrowStatusEnum), default=BorrowStatusEnum.available)
    lastBorrowed = Column(DateTime)
    publicationDate = Column(DateTime)
    added = Column(DateTime)