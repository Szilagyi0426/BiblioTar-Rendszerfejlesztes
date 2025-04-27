from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from app.schemas import librarian
from app.API.auth import get_current_user
from app.models import book, borrow, fine, reservation, user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.borrow import Borrow
from app.models.fine import Fine
from app.models.user import User

from app.schemas.auth import *
import app.unixTimeStamp as timestampByMil

router = APIRouter(
    dependencies=[Depends(get_current_user)] 
)

#router = APIRouter()
# Rent actions----------------------------

def admin_required(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin" and current_user.get("role") != "librarian":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nincs admin jogosultság" # Hibát dob
        )
    return current_user

@router.post("/rentToUser", dependencies=[Depends(admin_required)])
def rent_toUser(rentToUser: librarian.RentToUser, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    new_borrow = Borrow(**rent_toUser.dict())
    db.add(new_borrow)
    db.commit()

    return "Book rented to user"
    

@router.put("/rentReturn", dependencies=[Depends(admin_required)])
def rent_return(rentReturn: librarian.RentReturn, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    borrows = db.query(Borrow).filter(Borrow.bookId == rentReturn.id).first()
    borrows.endOfRental = 0
    db.commit()

    return "Rented book returned."


@router.put("/rentExtend", dependencies=[Depends(admin_required)])
def rent_extend(rentExtend: librarian.RentExtend, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    borrows = db.query(Borrow).filter(Borrow.bookId == rentExtend.id).first()
    borrows.noOfExtendedRental += 1

    return "Rent extended."

# Fine actions----------------------------
@router.post("/fineRent", dependencies=[Depends(admin_required)])
def fine_rent(rentFine: librarian.FineRent, current_user = Depends(get_current_user), db: Session = Depends(get_db)):

    new_fine = Fine(**rentFine.dict())
    db.add(new_fine)
    db.commit()

    return "Rent fined."

@router.delete("/fineDelete", dependencies=[Depends(admin_required)])
def fine_delete(fineDelete: librarian.FineDelete, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    
    db.query(Fine).filter(Fine.id == fineDelete.id).delete()
    db.commit()

    return "Fine deleted."

