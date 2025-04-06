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
