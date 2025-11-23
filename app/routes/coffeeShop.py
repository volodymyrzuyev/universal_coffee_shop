from fastapi import APIRouter
from databaseStuff.config import db

#importing Store so it can be used to call the db methods instead of directly calling them through db
from models.object_types import Store


coffeeShopRouter = APIRouter(
    prefix='/home',
    tags=["Gets specific coffeeshop"])




@coffeeShopRouter.get("/getCoffee_Shop/{coffeeShopName}")
async def getCoffeeShop(coffeeShopName: str):
    newStore = Store()
    return {"Coffeeshop":newStore.get_store_by_name(coffeeShopName)}

