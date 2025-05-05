from typing import Optional

from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    username: str
    password: str

class CreateUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class ChangeUserPass(BaseModel):
    passwordOld: str
    passwordNew: str
    passwordNew2: str
    
class ChangeUserName(BaseModel):
    usernameNew: str
    password: str

class ChangeUserEmail(BaseModel):
    userEmailNew: str
    password: str
    
class UserResponse(BaseModel):
    username: str
    email: EmailStr
    role: str
    access_token: Optional[str]
    refresh_token: Optional[str]

class TokenOnlyResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    
class userProfile(BaseModel):
    username: str
    email: EmailStr
    role: str
    address: Optional[str] = ""
    phonenumber: Optional[str] = ""

