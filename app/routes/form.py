from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from models import provider

router = APIRouter(
     tags=["Coffeeshop Form Submission"]
)

class CoffeeShop(BaseModel):
     coffeeShopName:str
     OwnerID:str
     streetAddress:str 
     city:str 
     state:str 
     PhoneNum:str 

 

@router.post("/items/")
async def getForm(CS : CoffeeShop):

    form_data = CS.model_dump()
    form_data_string = str(form_data)

    try:
        with open("form_data_txt.txt","a") as f:
              f.write(form_data_string + "\n")
        return {"status": "success", "message": "Form data saved", "data_received": form_data}

    except Exception as e:
        return {"status": "error", "message": f"Failed to save data: {e}"}