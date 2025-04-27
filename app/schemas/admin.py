from fastapi import FastAPI
from pydantic import BaseModel

class NewBook(BaseModel):
    id: int
    title: str
    author: str
    genre_id: int
    publicationDate: int
    publicator: str
    borrowStatus: int
    lastBorrowed: int
    added: int
    genres: str

class UpdateBook(BaseModel):
    id: int
    title: str
    author: str
    genre_id: int
    publicationDate: int
    publicator: str
    borrowStatus: int
    lastBorrowed: int
    added: int
    genres: str

class DeleteBook(BaseModel):
    id: int

class UpdateUserRole(BaseModel):
    user_id: int
    new_role: str

