from fastapi import FastAPI, APIRouter
from app.schemas import librarian
router = APIRouter()

# Rent actions----------------------------
@router.put("/rentToUser")
def rent_toUser(rentToUser: librarian.RentToUser):
    return "Book rented to User."

@router.put("/rentReturn")
def rent_return(rentReturn: librarian.RentReturn):
    return "Rented book returned."

@router.put("/rentExtend")
def rent_extend(rentExtend: librarian.RentExtend):
    return "Rent extended."

# Fine actions----------------------------
@router.put("/fineRent")
def fine_rent(rentFine: librarian.FineRent):
    return "Rent fined."

@router.put("/fineDelete")
def fine_delete(rentDelete: librarian.FineDelete):
    return "Fine deleted."