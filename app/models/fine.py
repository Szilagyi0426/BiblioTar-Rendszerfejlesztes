from sqlalchemy import Column, Integer, SmallInteger, String, DateTime, Boolean, ForeignKey
from app.database import Base
import app.unixTimeStamp as timestampByMil

class Fine(Base):
    __tablename__ = "fines" # Tábla neve

    id = Column(Integer, primary_key=True, index=True) # Azonosító
    borrowId = Column(Integer, ForeignKey("borrows.id")) # Kölcsönzés azonosítója
    amount = Column(SmallInteger) # Összeg
    reason = Column(String) # Indok
    issuedAt = Column(timestampByMil.UnixTimestampMillis) # Kiadás dátuma
    paid = Column(Boolean) # Kifizetve