from sqlalchemy import Table, ForeignKey, Column, Integer, String, Enum
from sqlalchemy.orm import relationship, Session
from app.database import Base, SessionLocal
import app.unixTimeStamp as timestampByMil
import enum
import time


class BorrowStatusEnum(str, enum.Enum): # A könyv kölcsönzési státuszait tartalmazza
    borrowed = "borrowed"
    available = "available"
    lost = "lost"
    damaged = "damaged"


class Genre(Base):
    __tablename__ = "genres" # Tábla neve

    id = Column(Integer, primary_key=True, index=True) # Azonosító
    name = Column(String, unique=True, nullable=False) # Műfaj neve

    books = relationship("Book", back_populates="genres") # Kapcsolat a könyvekkel


class Book(Base):
    __tablename__ = "books" # Tábla neve

    id = Column(Integer, primary_key=True, index=True) # Azonosító
    title = Column(String, nullable=False) # Cím
    author = Column(String, nullable=False) # Szerző
    genre_id = Column(Integer, ForeignKey("genres.id")) # Műfaj azonosítója
    publicationDate = Column(timestampByMil.UnixTimestampMillis) # Kiadás dátuma
    publicator = Column(String, nullable=False) # Kiadó
    borrowStatus = Column(Enum(BorrowStatusEnum), default=BorrowStatusEnum.available) # Kölcsönzési státusz
    lastBorrowed = Column(timestampByMil.UnixTimestampMillis) # Utolsó kölcsönzés dátuma
    added = Column(timestampByMil.UnixTimestampMillis) # Hozzáadás dátuma

    genres = relationship("Genre", back_populates="books") # Kapcsolat a műfajokkal
