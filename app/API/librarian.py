from fastapi import FastAPI, APIRouter
from app.schemas import librarian
router = APIRouter()

# Rent actions----------------------------
@router.put("/rentToUser")
def rent_toUser(rentToUser: librarian.rentToUser):
    return "Book rented to User."

@router.put("/rentReturn")
def rent_return(rentReturn: librarian.rentReturn):
    return "Rented book returned."

@router.put("/rentExtend")
def rent_extend(rentExtend: librarian.rentExtend):
    return "Rent extended."

# Fine actions----------------------------
@router.put("/fineRent")
def fine_rent(rentFine: librarian.rentFine):
    return "Rent fined."

@router.put("/fineDelete")
def fine_delete(rentDelete: librarian.rentDelete):
    return "Fine deleted."