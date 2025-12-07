from fastapi import APIRouter, Request
from pydantic import BaseModel
from databaseStuff.config import db


UserRouter = APIRouter(tags=["Admin account Creation endpoints"])


class Admin(BaseModel):
    username : str
    email : str
    password : str

class UpdateEmailUser(BaseModel):
   email: str
   user_id : str

class UpdatePasswordUser(BaseModel):
   password: str
   user_id: str
   
@UserRouter.post("/create_admin/{id}")
async def create_admin(id: str):
    db.set_admin(id)

@UserRouter.get("/get_users/")
async def get_users():
    data = db.get_all_users()
    print(type(data))
    return {"users":data}


#updates a user's email
@UserRouter.post("/updateEmail/")
async def updateEmail(userUpdatingEmail: UpdateEmailUser):
   print("ru here")
   db.update_user_email(userUpdatingEmail.email, userUpdatingEmail.user_id)
   return {"status": "success"}

@UserRouter.post("/updatePassword/")
async def updatePassword(userUpdatingPassword: UpdatePasswordUser):
   print("ru here")
   db.update_user_password(userUpdatingPassword.password, userUpdatingPassword.user_id)
   return {"status": "success"}


@UserRouter.get("/me/")
async def getUserData(request: Request):
    data = db.get_user_from_id(request.state.user_id)
    try:
        contactInfo = db.get_contact_info(request.state.user_id)
        dList = list(data)
        dList.append(contactInfo[2])
        data = tuple(dList)
    except:
        db.set_contact_info(request.state.user_id, data[2],"teset")
        dList = list(data)
        dList.append("")
        data = tuple(dList)
    print(data)
    return {"user":data }

@UserRouter.get("/updatePhoneNumber/{number}/")
async def updatePhoneNumber(number, request: Request):
    try:
        data = db.set_contact_phone_number(request.state.user_id, number)
    except:
        return "fail"
