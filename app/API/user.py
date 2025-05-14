from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from app.schemas.user import *
from app.API.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import *

router = APIRouter(
    dependencies=[Depends(get_current_user)] 
)
#-------------User data change requests---------------
@router.post("/changeAddress")
def change_address(newAddress: ChangeAddress, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.address = newAddress.address
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changePhoneNumber")
def change_phoneNumber(newPhoneNumber: ChangePhoneNumber, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.phonenumber = newPhoneNumber.phoneNumber
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changeEmail")
def change_email(newEmail: ChangeEmail, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.email = newEmail.email
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changeUsername")
def change_username(newUsername: ChangeUsername, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.username = newUsername.username
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changePassword")
def change_password(newPassword: ChangePassword, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.password = newPassword.password
    db.commit()
    return "Sikeres adatmódosítás!"
#-----------------------------------------------------


#-------------------Data listings---------------------
@router.get("/listBooks", response_model=ListBooks)
def list_books(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    #bookList = db.query(Book)
    return "Valid data"

@router.get("/listRentedBooks", response_model=ListRendtedBooks)
def list_rentedBooks(listRendtedBooks: ListRendtedBooks, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    userID = db.query(User).filter(User.username == current_user["username"]).first()
    reservationList = db.query(Reservation).filter(Reservation.userId == userID.id).all()
    #reservationList.filter(userID.id == reservationList.)
    return "Valid data"

@router.get("/listPersonalRents", response_model=ListPersonalRents)
def list_personalRents(listPersonalRents: ListPersonalRents, current_user = Depends(get_current_user)):
    return "Valid data"

@router.get("/listPersonalFines", response_model=ListPersonalFines)
def list_peronalFines(listPersonalFines: ListPersonalFines, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------


#---------------Book renting related------------------
@router.post("/rentBook")
def rent_book(rentBook: RentBook, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/rentCancel")
def rent_cancel(rentCancel: RentCancel, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/rentExtend")
def rent_extend(rentExtend: RentExtend, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------


#--------------------Other calls----------------------
@router.post("/payFine")
def pay_fine(payFine: PayFine, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/preRentBook")
def pre_rentBook(preRentBook: PreRentBook, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------