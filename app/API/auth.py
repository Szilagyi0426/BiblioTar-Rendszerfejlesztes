from fastapi import FastAPI, APIRouter
from app.schemas.auth import *


router = APIRouter()

@router.get("/login")
def login(user_data: UserLogin):
    return {"message": "Belépés sikeres"}

@router.get("/logout")
def logout():
    return {"message": "Kijelentkezés sikeres"}

@router.get("/register")
def register(user_data: CreateUser):
    return {"message": "Regisztráció sikeres"}

@router.get("/changePassword")
def change_password(user_data: ChangeUserPass):
    return {"message": "Jelszó megváltoztatása sikeres"}

@router.get("/changeUsername")
def change_username(user_data: ChangeUserName):
    return {"message": "Felhasználónév megváltoztatása sikeres"}

@router.get("/changeEmail")
def change_email(user_data: ChangeUserEmail):
    return {"message": "Email megváltoztatása sikeres"}


