from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from models import provider

class CoffeeShop(BaseModel):
     OwnerName:str
     streetAddress:str 
     city:str 
     state:str 
     PhoneNum:str 

router = APIRouter()

@router.post("/recieveForm")
async def getForm(CS : CoffeeShop):
    return CS