from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Adatbázis konfiguráció (példa: SQLite, módosítsd a saját igényeid szerint)
    database_url: str = "sqlite:///./bibliotar.db"

settings = Settings()
