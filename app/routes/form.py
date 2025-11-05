from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from models import provider

class CoffeeShop(BaseModel):
     coffeeShopName:str
     OwnerID:str
     streetAddress:str 
     city:str 
     state:str 
     PhoneNum:str 

router = APIRouter()

@router.post("/recieveForm")
def getForm(CS : CoffeeShop):
    print(f"Recieved data: Name={CS.coffeeShopName}")
   

    return {
        "status": "success"     
    }