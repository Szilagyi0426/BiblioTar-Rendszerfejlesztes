from fastapi import FastAPI
from pydantic import BaseModel

class RentToUser(BaseModel):
    idUser: int
    idBook: int

class RentReturn(BaseModel):
    id: int

class RentExtend(BaseModel):
    id: int

class FineRent(BaseModel):
    id: int
    amount: int

class FineDelete(BaseModel):
    id: int