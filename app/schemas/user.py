from typing import Optional
from pydantic import BaseModel, EmailStr

#--------------------------------------
class ChangeAddress(BaseModel):
    address: str

class ChangePhoneNumber(BaseModel):
    phoneNumber: str

class ChangeEmail(BaseModel):
    email: EmailStr

class ChangeUsername(BaseModel):
    username: str

class ChangePassword(BaseModel):
    password: str


#--------------------------------------
class ListBooks(BaseModel):
    id: int
    title: str
    author: str
    genre: str

class ListRendtedBooks(BaseModel):
    id: str

class ListPersonalRents(BaseModel):
    name: str

class ListPersonalFines(BaseModel):
    name: str


#--------------------------------------
class RentBook(BaseModel):
    idBook: int
    idUser: int

class RentCancel(BaseModel):
    idRent: int

class RentExtend(BaseModel):
    name: str


#--------------------------------------
class PayFine(BaseModel):
    id: int

class PreRentBook(BaseModel):
    name: str