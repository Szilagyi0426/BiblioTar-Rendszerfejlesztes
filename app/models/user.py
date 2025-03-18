from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    user = "user"
    librarian = "librarian"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)
    address = Column(String)
    phonenumber = Column(String)
