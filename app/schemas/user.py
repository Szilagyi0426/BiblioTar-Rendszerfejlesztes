from typing import Optional
from pydantic import BaseModel, EmailStr
#--------------------------------------
class ChangeAddress(BaseModel):
    address: str

class ChangePhoneNumber(BaseModel):
    phoneNumber: str

class ChangeEmail(BaseModel):
    email: str
    password: str

class ChangeUsername(BaseModel):
    username: str
    password: str

class ChangePassword(BaseModel):
    passwordNew: str
    passwordOld: str


#--------------------------------------
class searchListBooks(BaseModel):
    searchText: str = ""

class ListRendtedBooks(BaseModel):
    id: str

class ListPersonalRents(BaseModel):
    name: str

class ListPersonalFines(BaseModel):
    name: str


#--------------------------------------
class RentBook(BaseModel):
    userName: str
    bookID: str
    startDate: str
    endDate: str

class RentCancel(BaseModel):
    rentID: int

class RentExtend(BaseModel):
    rentID: int
    newEndDate: str


#--------------------------------------
class PayFine(BaseModel):
    fineID: int

class PreRentBook(BaseModel):
    name: str