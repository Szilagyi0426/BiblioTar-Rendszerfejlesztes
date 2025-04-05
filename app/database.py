from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# SQLite speciális kapcsolati argumentumok
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args) # Adatbázis kapcsolat létrehozása
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # SessionLocal objektum létrehozása

# Definiáljuk a Base objektumot a modellekhez
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
