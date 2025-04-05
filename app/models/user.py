from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import Session
from app.database import Base, SessionLocal
import enum

class RoleEnum(str, enum.Enum): # A felhasználók szerepeit tartalmazza
    user = "user"
    librarian = "librarian"
    admin = "admin"

class User(Base):
    __tablename__ = "users" # Tábla neve
    
    id = Column(Integer, primary_key=True, index=True) # Azonosító
    email = Column(String, nullable=False) # Email cím
    username = Column(String, nullable=False) # Felhasználónév
    password = Column(String, nullable=False) # Jelszó (titkosítva)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)  # Szerep
    address = Column(String) # Cím
    phonenumber = Column(String) # Telefonszám

# 
# def init_default_users():
#     db: Session = SessionLocal()
#     default_genres = [
#         "Fantasy", "Adventure", "Romance", "Science Fiction",
#         "History", "Biography", "Mystery", "Horror",
#         "Self-help", "Educational"
#     ]
# 
#     existing_users = db.query(User).count()
#     if existing_users == 0:
#         default_users = [
#             User(email="admin@example.com", username="admin", password=pwd_context.hash(password), role=RoleEnum.admin),
#             User(email="librarian@example.com", username="librarian", password=hash_password("librarian"), role=RoleEnum.librarian),
#             User(email="user@example.com", username="user", password=hash_password("user"), role=RoleEnum.user)
#         ]
# 
#         db.add_all(default_users)
#         db.commit()
# 
#     db.close()

#init_default_users()
