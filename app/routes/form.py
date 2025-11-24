#this file is a fastAPI endpoint for the for receiving the form that 
#user fills out. 

from models.object_types import Store
from fastapi import APIRouter
from pydantic import BaseModel
from databaseStuff.config import db


FormRouter = APIRouter(tags=["Coffeeshop Form Submission"])


class CoffeeShop(BaseModel):
    coffee_shop_name: str
    owner_id: str
    street_address: str
    city: str
    state: str
    phone_number: str
    logo_url: str



@FormRouter.post("/recieveForm/")
async def getForm(CS: CoffeeShop):
    #create an instance of a Store object to call the database method
    newStore = Store()

    newStore.add(
            CS.coffee_shop_name,
            CS.owner_id,
            CS.street_address,
            CS.city,
            CS.state,
            int(CS.phone_number.replace("-", "")),
            CS.logo_url)

    return {"storeName":CS.coffee_shop_name}
