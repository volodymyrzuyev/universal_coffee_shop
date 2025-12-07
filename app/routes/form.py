#this file is the fastapi endpoints for creating, updating, or deleting
# a coffeeshop.

from models.object_types import Store
from fastapi import APIRouter, Request
from pydantic import BaseModel

FormRouter = APIRouter(tags=["Coffeeshop Form Submission"])

#instance of the Store object of the methods we will be calling
store_instance = Store()

#this is the class model for a coffeeshop when a form is recieved
class CoffeeShop(BaseModel):
    coffee_shop_name: str
    street_address: str
    city: str
    state: str
    phone_number: str
    picture_url: str

#this is the class model for an updated coffeeshop, which includes
# the shop id for the database method
class UpdateCoffeeShop(BaseModel):
    coffee_shop_id: str
    coffee_shop_name: str
    street_address: str
    city: str
    state: str
    phone_number: str
    picture_url: str

#this endpoint recieves the coffeeshop form a user has filled out
@FormRouter.post("/recieveForm/")
async def getForm(CS: CoffeeShop, request: Request):
    """
    Docstring for getForm
    
    :param CS: The object that represents the incoming data from the frontend
    :type CS: CoffeeShop
    :param request: Http request data
    :type request: Request
    """
    store_instance.add(
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
    """
    Docstring for getUpdateForm
    
    :param UCS: An UpdateCoffeeShop object representing the data we're receiving from the frontend
    :type UCS: UpdateCoffeeShop
    """
    store_instance.updateCoffeeshop(
            UCS.coffee_shop_id,
            UCS.coffee_shop_name,
            UCS.street_address,
            UCS.city,
            UCS.state,
            int(UCS.phone_number.replace("-", "")),
            UCS.picture_url)

    return {"storeName":UCS.coffee_shop_name}

@FormRouter.delete("/deleteCoffeeshop/{selectedShop}")
async def deleteCoffeeshop(selectedShop):
    """
    Docstring for deleteCoffeeshop
    
    :param selectedShop: the id of the shop to be deleted
    """
    store_instance.delete(selectedShop)
