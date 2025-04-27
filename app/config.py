from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # JWT konfigurációk
    authjwt_secret_key: str = "Rendszerfejlesztes"
    authjwt_access_token_expires: int = 15 * 60         # 15 perc másodpercben
    authjwt_refresh_token_expires: int = 30 * 24 * 3600   # 30 nap másodpercben
    
    # Adatbázis konfiguráció (példa: SQLite, módosítsd a saját igényeid szerint)
    database_url: str = "sqlite:///./bibliotar.db"

settings = Settings()
