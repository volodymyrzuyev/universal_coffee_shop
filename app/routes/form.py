#this file is a fastAPI endpoint for the for receiving the form that 
#user fills out. 

from models.object_types import Store
from fastapi import APIRouter, Request
from pydantic import BaseModel
from databaseStuff.config import db


FormRouter = APIRouter(tags=["Coffeeshop Form Submission"])


class CoffeeShop(BaseModel):
    coffee_shop_name: str
    street_address: str
    city: str
    state: str
    phone_number: str
    picture_url: str


class UpdateCoffeeShop(BaseModel):
    coffee_shop_id: str
    coffee_shop_name: str
    street_address: str
    city: str
    state: str
    phone_number: str
    picture_url: str



@FormRouter.post("/recieveForm/")
async def getForm(CS: CoffeeShop, request: Request):
    #create an instance of a Store object to call the database method
    newStore = Store()
    newStore.add(
            CS.coffee_shop_name,
            request.state.user_id,
            CS.street_address,
            CS.city,
            CS.state,
            int(CS.phone_number.replace("-", "")),
            CS.picture_url)

    return {"storeName":CS.coffee_shop_name}

@FormRouter.post("/updateCoffeeshop")
async def getUpdateForm(UCS: UpdateCoffeeShop):
    #create an instance of a Store object to call the database method

    print("hello")
    newStore = Store()
    newStore.updateCoffeeshop(
            UCS.coffee_shop_id,
            UCS.coffee_shop_name,
            UCS.street_address,
            UCS.city,
            UCS.state,
            int(UCS.phone_number.replace("-", "")),
            UCS.picture_url)

    return {"storeName":UCS.coffee_shop_name}