from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.admin import NewBook, UpdateBook, DeleteBook, UpdateUserRole
from app.auth import get_current_user
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.book import Book
from app.models.user import User

router = APIRouter()

# ---------------- Admin - Book Management ----------------

@router.post("/addBook")
def add_book(newBook: NewBook, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")

    book = Book(**newBook.dict())
    db.add(book)
    db.commit()
    db.refresh(book)
    return {"message": "Book successfully added.", "book_id": book.id}

@router.put("/updateBook")
def update_book(bookUpdate: UpdateBook, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")

    book = db.query(Book).filter(Book.id == bookUpdate.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    for field, value in bookUpdate.dict().items():
        if field != "id":
            setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return {"message": "Book successfully updated."}

@router.delete("/deleteBook")
def delete_book(bookDelete: DeleteBook, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")

    book = db.query(Book).filter(Book.id == bookDelete.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")

    db.delete(book)
    db.commit()
    return {"message": "Book successfully deleted."}

# ---------------- Admin - User Management ----------------

@router.patch("/updateUserRole")
def update_user_role(roleUpdate: UpdateUserRole, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")

    user = db.query(User).filter(User.id == roleUpdate.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.role = roleUpdate.new_role
    db.commit()
    db.refresh(user)
    return {"message": f"User role successfully updated to '{user.role}'."}
