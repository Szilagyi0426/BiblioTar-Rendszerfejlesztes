from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from app.schemas.user import *
from app.API.auth import get_current_user, hash_password, verify_password
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import *
from fastapi.responses import HTMLResponse
from datetime import datetime

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

@router.post("/changePhoneNumer")
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
    users.password = hash_password(newPassword.password)
    db.commit()
    return "Sikeres adatmódosítás!"
#-----------------------------------------------------


#-------------------Data listings---------------------
@router.get("/listBooks", response_class=HTMLResponse)
def list_books(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    bookList = db.query(Book).all()
    book_items = "".join(
        "<li>" 
            "<img src='/img/book-cover-placeholder.png' alt='Book Cover(placeholder)' />"
            "<div class='book-details'>"
                f"<span>{book.title}</span>"
                f"<span>{book.author}</span>"
            "</div>"
            f'<button class="buttonStyle" data-book-id="{book.id}">Kikölcsönzés</button>'
        "</li>" for book in bookList
    )
    html = f"""
    <html>
        <body>
            <h1>Kölcsönözhető könyvek listája</h1>
            <div id="search-bar-container">
            <input
                type="text"
                id="search-bar"
                placeholder="Keresés a könyvek között..."
                style="width: 100%; padding: 0.5em; font-size: 1em; margin-bottom: 1em;"
            />
            </div>
            <ul>
                {book_items}
            </ul>
        </body>
    </html>
    """
    return html

@router.get("/listRentedBooks", response_class=HTMLResponse)
def list_rentedBooks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    userID = db.query(User).filter(User.username == current_user["username"]).first()
    borrowList = db.query(Borrow).filter(Borrow.userId == userID.id).all()
    # Header row
    header = (
        "<li class='header-row'>"
        "<span>Cím</span>"
        "<span>Kezdés</span>"
        "<span>Lejárat</span>"
        "<span>Büntetés</span>"
        "<span></span>"
        "</li>"
    )
    fines = ""
    for borrow in borrowList:
        book = db.query(Book).filter(borrow.bookId == Book.id).first()
        fine = db.query(Fine).filter(borrow.id == Fine.borrowId).first()
        has_fine = fine and fine.amount
        if has_fine:
            button_html = (
                f'<button class="buttonStyle" data-borrow-id="{borrow.id}">Büntetés fizetése</button>'
            )
        else:
            button_html = (
                f'<button class="buttonStyle">Kölcsönzés szerkesztése</button>'
            )
        fines += (
            "<li>"
            f"<span>{book.title if book else ''}</span>"
            f"<span>{borrow.startOfRental}</span>"
            f"<span>{borrow.endOfRental}</span>"
            f"<span>{str(fine.amount) + ' Ft' if fine else 'Nincs büntetés'}</span>"
            f"{button_html}"
            "</li>"
        )
    html = f"""
    <html>
        <body>
            <h1>Kikölcsönzött könyvek</h1>
            <ul>
                {header}
                {fines}
            </ul>
        </body>
    </html>
    """
    return html
#-----------------------------------------------------


#---------------Book renting related------------------
@router.post("/rentBook")
def rent_book(rentBook: RentBook, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Parse dates
    start_d = datetime.strptime(rentBook.startDate, "%Y-%m-%d")
    end_d = datetime.strptime(rentBook.endDate, "%Y-%m-%d")

    start = int(start_d.timestamp() * 1000)
    end = int(end_d.timestamp() * 1000)

    # Check for overlapping reservations
    overlapping = db.query(Borrow).filter(
        Borrow.bookId == rentBook.bookID,
        Borrow.endOfRental >= start,
        Borrow.startOfRental <= end
    ).first()

    if overlapping:
        raise HTTPException(status_code=400, detail="A könyv már le van foglalva a kiválasztott időszakban.")
    # Check if the book is available
    book = db.query(Book).filter(Book.id == rentBook.bookID).first()
    if not book:
        raise HTTPException(status_code=404, detail="A könyv nem található.")
    if book.borrowStatus == BorrowStatusEnum.lost:
        raise HTTPException(status_code=400, detail="A könyv nem elérhető.")
    # Create a new borrow record
    new_reservation = Reservation(
        userId=db.query(User).filter(User.username == current_user["username"]).first().id,
        bookId=book.id,
        reservationDate=start,
        status=ReservationStatusEnum.active,
    )
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    new_borrow = Borrow(
        userId=db.query(User).filter(User.username == current_user["username"]).first().id,
        reservationId=new_reservation.id,
        bookId=book.id,
        startOfRental=start,
        endOfRental=end,
        noOfExtendedRental=0,
    )

    db.add(new_borrow)
    book.borrowStatus = BorrowStatusEnum.borrowed
    book.lastBorrowed = start
    db.commit()

@router.post("/rentCancel")
def rent_cancel(rentCancel: RentCancel, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return "Valid data"

@router.post("/rentExtend")
def rent_extend(rentExtend: RentExtend, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------


#--------------------Other calls----------------------
@router.post("/payFine")
def pay_fine(payFine: PayFine, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Check if the fine exists
    fine = db.query(Fine).filter(Fine.id == payFine.fineID).first()
    borrow = db.query(Borrow).filter(Borrow.id == fine.borrowId).first()
    if not fine:
        raise HTTPException(status_code=404, detail="A büntetés nem található.")
    # Check if the user has already paid the fine
    #if fine.paid:
        #raise HTTPException(status_code=400, detail="A büntetést már kifizették.")
    # Update the book status
    book = db.query(Book).filter(Book.id == borrow.bookId).first()
    if book:
        book.borrowStatus = BorrowStatusEnum.available
        db.commit()
    # Update the reservation record
    reservation = db.query(Reservation).filter(Reservation.id == borrow.reservationId).first()
    if reservation:
        reservation.status = ReservationStatusEnum.fulfilled
        db.commit()
    # Update the fine record
    db.delete(fine)
    db.delete(borrow)
    db.commit()
    return "Büntetés sikeresen kifizetve."

@router.post("/preRentBook")
def pre_rentBook(preRentBook: PreRentBook, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return "Valid data"
#-----------------------------------------------------