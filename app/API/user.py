from fastapi import FastAPI, APIRouter

router = APIRouter()

@router.get("/listBooks")
def list_books():
    return {"message": "List of books"}
