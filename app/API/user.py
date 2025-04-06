from fastapi import FastAPI, APIRouter

router = APIRouter()

#-------------User data change requests---------------
@router.get("/changeAddress")
def change_address():
    return {"message": "Change Address"}

@router.get("/changePhoneNumer")
def change_phoneNumber():
    return {"message": "Change Phone Number"}

@router.get("/changeEmail")
def change_emaul():
    return {"message": "Change Email"}

@router.get("/changeUsername")
def change_username():
    return {"message": "Change Username"}

@router.get("/changePassword")
def change_password():
    return {"message": "Change Password"}
#-----------------------------------------------------


#-------------------Data listings---------------------
@router.get("/listBooks")
def list_books():
    return {"message": "List of books"}

@router.get("/listRentedBooks")
def list_rentedBooks():
    return {"message": "List of Rented books"}

@router.get("/listPersonalRents")
def list_personalRents():
    return {"message": "List of Personal Rents"}

@router.get("/listPersonalFines")
def list_peronslaFines():
    return {"message": "List of Personal Fines"}
#-----------------------------------------------------


#---------------Book renting related------------------
@router.get("/rentBook")
def rent_book():
    return {"message": "Rent Book"}

@router.get("/rentCancel")
def rent_cancel():
    return {"message": "Cancel Rent"}

@router.get("/rentExtend")
def rent_extend():
    return {"message": "Extend Rent"}
#-----------------------------------------------------


#--------------------Other calls----------------------
@router.get("/payFine")
def pay_fine():
    return {"message": "Pay Fine"}

@router.get("/preRentBook")
def pre_rentBook():
    return {"message": "Pre-rent Book"}
#-----------------------------------------------------