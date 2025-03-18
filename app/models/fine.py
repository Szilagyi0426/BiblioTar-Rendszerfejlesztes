from sqlalchemy import Column, Integer, SmallInteger, String, DateTime, Boolean, ForeignKey
from app.database import Base

class Fine(Base):
    __tablename__ = "fines"

    id = Column(Integer, primary_key=True, index=True)
    borrowId = Column(Integer, ForeignKey("borrowes.id"))
    amount = Column(SmallInteger)
    reason = Column(String)
    issuedAt = Column(DateTime)
    paid = Column(Boolean)