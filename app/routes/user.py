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
   
    
@UserRouter.post("/createAdmin/")
async def getForm(admin: Admin):

 db.create_user("userid",admin.username, admin.email, admin.password, True)
 return {"status": "success"}

#updates a user's email
@UserRouter.post("/updateEmail/")
async def updateEmail(userUpdatingEmail: UpdateEmailUser):
   print("ru here")
   db.update_user_email(userUpdatingEmail.email, userUpdatingEmail.user_id)
   return {"status": "success"}

@UserRouter.get("/me/")
async def getUserData(request: Request):
    data = db.get_user_from_id(request.state.user_id)
    print(data)
    return {"user":data }

   
    
    


