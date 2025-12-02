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
   
@UserRouter.get("/create_admin/{id}")
async def create_admin(id: str):
    db.set_admin(id)

@UserRouter.get("/get_users/")
async def get_users():
    data = db.get_all_users()
    return data


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
    print(data)
    return {"user":data }

   
    
    


