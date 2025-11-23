from fastapi import APIRouter
from databaseStuff.config import db

#importing Store so it can be used to call the db methods instead of directly calling them through db
from models.object_types import Store


coffeeShopRouter = APIRouter(
    prefix='/home',
    tags=["Gets specific coffeeshop"])

#Store object that is created to call the methods in the database
newStore = Store()

#@coffeeShopRouter.get("/getCoffeeShop/{coffeeShopName}")
#async def getCoffeeShop(coffeeShopName: str):
 #   return {"Coffeeshop":newStore.get_all_stores_by_name(coffeeShopName)}

#endpoint that returns all coffeeshops in the database by name only
@coffeeShopRouter.get("/getAllCoffeeShopsByName")
async def getAllCoffeeShopsByName():
    return {"Coffeeshops": newStore.get_all_stores_by_name()}
    

    

