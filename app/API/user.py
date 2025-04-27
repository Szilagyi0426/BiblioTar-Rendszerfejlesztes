from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from app.schemas.user import *
from app.API.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import *

router = APIRouter(
    dependencies=[Depends(get_current_user)] 
)

def dependecyCheck(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") == "": # Ha a felhasználó nincs bejelentkezve
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nincs bejelentkezve!" # Hibát dob
        )
    return current_user

#-------------User data change requests---------------
@router.post("/changeAddress", dependencies=[Depends(dependecyCheck)])
def change_address(newAddress: ChangeAddress, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.address = newAddress.address
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changePhoneNumer", dependencies=[Depends(dependecyCheck)])
def change_phoneNumber(newPhoneNumber: ChangePhoneNumber, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.phonenumber = newPhoneNumber.phoneNumber
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changeEmail", dependencies=[Depends(dependecyCheck)])
def change_email(newEmail: ChangeEmail, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.email = newEmail.email
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changeUsername", dependencies=[Depends(dependecyCheck)])
def change_username(newUsername: ChangeUsername, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.username = newUsername.username
    db.commit()
    return "Sikeres adatmódosítás!"

@router.post("/changePassword", dependencies=[Depends(dependecyCheck)])
def change_password(newPassword: ChangePassword, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    users = db.query(User).filter(User.username == current_user["username"]).first()
    users.password = newPassword.password
    db.commit()
    return "Sikeres adatmódosítás!"
#-----------------------------------------------------


#-------------------Data listings---------------------
@router.get("/listBooks", response_model=ListBooks, dependencies=[Depends(dependecyCheck)])
def list_books(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    bookList = db.query(Book)
    return "Valid data"

@router.get("/listRentedBooks", response_model=ListRendtedBooks, dependencies=[Depends(dependecyCheck)])
def list_rentedBooks(listRendtedBooks: ListRendtedBooks, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    userID = db.query(User).filter(User.username == current_user["username"]).first()
    reservationList = db.query(Reservation).filter(Reservation.userId == userID.id).all()
    #reservationList.filter(userID.id == reservationList.)
    return "Valid data"

@router.get("/listPersonalRents", response_model=ListPersonalRents, dependencies=[Depends(dependecyCheck)])
def list_personalRents(listPersonalRents: ListPersonalRents, current_user = Depends(get_current_user)):
    return "Valid data"

@router.get("/listPersonalFines", response_model=ListPersonalFines, dependencies=[Depends(dependecyCheck)])
def list_peronalFines(listPersonalFines: ListPersonalFines, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------


#---------------Book renting related------------------
@router.post("/rentBook", dependencies=[Depends(dependecyCheck)])
def rent_book(rentBook: RentBook, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/rentCancel", dependencies=[Depends(dependecyCheck)])
def rent_cancel(rentCancel: RentCancel, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/rentExtend", dependencies=[Depends(dependecyCheck)])
def rent_extend(rentExtend: RentExtend, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------


#--------------------Other calls----------------------
@router.post("/payFine", dependencies=[Depends(dependecyCheck)])
def pay_fine(payFine: PayFine, current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/preRentBook", dependencies=[Depends(dependecyCheck)])
def pre_rentBook(preRentBook: PreRentBook, current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------