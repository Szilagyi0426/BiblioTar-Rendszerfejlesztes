from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import admin
from app.api.auth import get_current_user

router = APIRouter()
#-----------------Admin book management ------------------

@router.post("/addBook")
def add_book(newBook: admin.NewBook, current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")
    return "Book added"

@router.put("/updateBook")
def update_book(bookUpdate: admin.UpdateBook, current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")
    return "Book updated"

@router.delete("/deleteBook")
def delete_book(bookDelete: admin.DeleteBook, current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")
    return "Book deleted"

# -----------------Admin user management ------------------

@router.patch("/updateUserRole")
def update_user_role(roleUpdate: admin.UpdateUserRole, current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can access")
    return f"User {roleUpdate.user_id} role updated to {roleUpdate.new_role}"

#-----------------------------------------------------
