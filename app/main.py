from fastapi import FastAPI
from app.database import Base, engine
from app.API import auth, user, librarian, admin
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="BiblioTár API", version="1.0.0")

app.include_router(auth.router, prefix="/authAPIs", tags=["auth"])
app.include_router(user.router, prefix="/userAPIs", tags=["user"])
app.include_router(librarian.router, prefix="/librarianAPIs", tags=["librarian"])
app.include_router(admin.router, prefix="/adminAPIs", tags=["admin"])

@app.get("/")
def read_root():
    return {"message": "BiblioTár backend elindult"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)