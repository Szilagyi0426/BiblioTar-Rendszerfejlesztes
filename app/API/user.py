from fastapi import FastAPI, APIRouter
from app.schemas import user

router = APIRouter()

#-------------User data change requests---------------
@router.put("/changeAddress", )
def change_address(changeAddress: user.ChangeAddress):
    return "Valid data"

@router.put("/changePhoneNumer")
def change_phoneNumber(changePhoneNumber: user.ChangePhoneNumber):
    return "Valid data"

@router.put("/changeEmail")
def change_email(changeEmail: user.ChangeEmail):
    return "Valid data"

@router.put("/changeUsername")
def change_username(changeUsername: user.ChangeUsername):
    return "Valid data"

@router.put("/changePassword")
def change_password(changePassword: user.ChangePassword):
    return "Valid data"
#-----------------------------------------------------


#-------------------Data listings---------------------
@router.get("/listBooks")
def list_books(listBooks: user.ListBooks):
    return "Valid data"

@router.get("/listRentedBooks")
def list_rentedBooks(listRendtedBooks: user.ListRendtedBooks):
    return "Valid data"

@router.get("/listPersonalRents")
def list_personalRents(listPersonalRents: user.ListPersonalRents):
    return "Valid data"

@router.get("/listPersonalFines")
def list_peronalFines(listPersonalFines: user.ListPersonalFines):
    return "Valid data"
#-----------------------------------------------------


#---------------Book renting related------------------
@router.put("/rentBook")
def rent_book(rentBook: user.RentBook):
    return "Valid data"

@router.put("/rentCancel")
def rent_cancel(rentCancel: user.RentCancel):
    return "Valid data"

@router.put("/rentExtend")
def rent_extend(rentExtend: user.RentExtend):
    return "Valid data"
#-----------------------------------------------------


#--------------------Other calls----------------------
@router.put("/payFine")
def pay_fine(payFine: user.PayFine):
    return "Valid data"

@router.put("/preRentBook")
def pre_rentBook(preRentBook: user.PreRentBook):
    return "Valid data"
#-----------------------------------------------------