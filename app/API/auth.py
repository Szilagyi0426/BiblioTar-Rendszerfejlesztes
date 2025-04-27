from app.schemas.auth import *
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.config import settings
import jwt
import datetime
from passlib.context import CryptContext


router = APIRouter()
security = HTTPBearer()

# Globális, in-memory blacklist a tokenek érvénytelenítéséhez
blacklist = set()

# Passlib beállítások a jelszó hash-eléséhez és ellenőrzéséhez
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Jelszó hash-elése."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ellenőrzi, hogy a plain jelszó megfelel-e a hash-elt jelszónak."""
    return pwd_context.verify(plain_password, hashed_password)

# --- Token műveletek ---

def create_token(subject: str, expires_delta: int, additional_claims: dict = None) -> str:
    """
    JWT token létrehozása a megadott subject, lejárati idő (másodpercben)
    és extra claim-ek alapján.
    """
    expire = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_delta)
    payload = {"sub": subject, "exp": int(expire.timestamp())}
    if additional_claims:
        payload.update(additional_claims)
    token = jwt.encode(payload, settings.authjwt_secret_key, algorithm="HS256")
    return token

def decode_token(token: str) -> dict:
    """
    A token dekódolása a titkos kulccsal és az HS256 algoritmussal.
    Hibakezeléssel, ha a token lejárt vagy érvénytelen.
    """
    try:
        payload = jwt.decode(token, settings.authjwt_secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token lejárt")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token érvénytelen")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency, amely az Authorization headerből érkező tokenből
    kinyeri a felhasználó azonosítóját és role értékét.
    Ellenőrzi, hogy a token nincs-e a blacklistben.
    """
    token = credentials.credentials
    if token in blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tiltott")
    payload = decode_token(token)
    return {"username": payload["sub"], "role": payload.get("role", "user")}

def refresh_access_token(refresh_token: str) -> str:
    """
    Ellenőrzi a refresh token-t, és ha érvényes (az extra claim {"refresh": True} szerepel benne),
    létrehoz egy új access token-t.
    """
    payload = decode_token(refresh_token)
    if not payload.get("refresh", False):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nem refresh token")
    new_access_token = create_token(
        subject=payload["sub"],
        expires_delta=settings.authjwt_access_token_expires
    )
    return new_access_token

@router.post("/register",  response_model=UserResponse)
def register(user_data: CreateUser, db: Session = Depends(get_db)):
    """
   Regisztráció:
     - Ellenőrzi, hogy a felhasználónév nem foglalt.
     - Létrehozza az új felhasználót, a jelszót hash-eli,
       majd tokeneket generál az auth modul segítségével.
   """
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A felhasználónév már foglalt"
        )
    new_user = User(**user_data.dict())
    new_user.password = hash_password(user_data.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    additional_claims = {"role": "user"}
    access_token = create_token(
        subject=new_user.username,
        expires_delta=settings.authjwt_access_token_expires,
        additional_claims=additional_claims
    )
    refresh_token = create_token(
        subject=new_user.username,
        expires_delta=settings.authjwt_refresh_token_expires,
        additional_claims={"refresh": True}
    )
    return UserResponse(
        username=new_user.username,
        email=new_user.email,
        role=additional_claims["role"],
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post("/login", response_model=UserResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
   Bejelentkezés:
     - Ellenőrzi, hogy a felhasználó létezik és a jelszó helyes.
     - Siker esetén az auth modul create_token() függvényével generálja az access és refresh tokeneket.
     - A tokenek payload-jában szerepel a felhasználó role-ja.
   """
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hibás felhasználónév vagy jelszó"
        )
    additional_claims = {"role": user.role}  # Ezt az értéket akár a felhasználó modelledből is lekérheted
    access_token = create_token(
        subject=user.username,
        expires_delta=settings.authjwt_access_token_expires,
        additional_claims=additional_claims
    )
    refresh_token = create_token(
        subject=user.username,
        expires_delta=settings.authjwt_refresh_token_expires,
        additional_claims={"refresh": True}
    )
    return UserResponse(
        username=user.username,
        email=user.email,
        role=additional_claims["role"],
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.delete("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Kijelentkezés:
      - Az Authorization headerből kinyert token-t hozzáadja a blacklisthez,
        így később nem használható.
    """
    token = credentials.credentials
    blacklist.add(token)
    return {"msg": "Sikeres kijelentkezés"}



@router.post("/token/refresh", response_model=UserResponse)
def refresh(request: Request):
    """
    Token frissítés:
      - Az Authorization headerből kinyeri a refresh token-t,
        ellenőrzi azt, majd új access token-t generál.
      - A válaszban visszaküldi az új access token-t.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token hiányzik")
    try: 
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise ValueError("Érvénytelen hitelesítési séma")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Érvénytelen Authorization header")
    if token in blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tiltólistán van")

    new_access_token = refresh_access_token(token)
    blacklist.add(token)
    return TokenOnlyResponse(access_token=new_access_token)