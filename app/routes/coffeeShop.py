from fastapi import APIRouter
from databaseStuff.config import db


coffeeShopRouter = APIRouter(
    prefix='/home',
    tags=["Gets specific coffeeshop"])




@coffeeShopRouter.get("/getCoffee_Shop/{coffeeShopName}")
async def getCoffeeShop(coffeeShopName: str):
    return {"Coffeeshop":db.get_store_by_name(coffeeShopName)}

