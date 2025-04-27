from fastapi import FastAPI, APIRouter
from app.schemas import admin

router = APIRouter()
#-----------------Admin book management ------------------

@router.post("/addBook")
def add_book(newBook: admin.NewBook):
    return "Book added"

@router.put("/updateBook")
def update_book(bookUpdate: admin.UpdateBook):
    return "Book updated"

@router.delete("/deleteBook")
def delete_book(bookDelete: admin.DeleteBook):
    return "Book deleted"

# -----------------Admin user management ------------------

@router.patch("/updateUserRole")
def update_user_role(roleUpdate: admin.UpdateUserRole):
    return f"User {roleUpdate.user_id} role updated to {roleUpdate.new_role}"

#-----------------------------------------------------
