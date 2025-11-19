from fastapi import APIRouter
from pydantic import BaseModel
from databaseStuff.config import db


UserRouter = APIRouter(tags=["Admin account Creation endpoints"])


class Admin(BaseModel):
    username : str
    email : str
    password : str
    
@UserRouter.post("/createAdmin/")
async def getForm(admin: Admin):

 db.create_user("userid",admin.username, admin.email, admin.password, True)
 return {"status": "success"}
    
    


