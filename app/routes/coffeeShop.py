from fastapi import APIRouter


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

#endpoint that returns all information from all coffeeshops
@coffeeShopRouter.get("/get_all_coffeeshops")
async def get_all_coffeeshops():
    return {"Coffeeshops": newStore.get_all_coffeeshops()}

#endpoint that returns all information from a singular coffeeshop by its id
@coffeeShopRouter.get("/get_coffeeshop_by_id/{shop_id}")
async def get_coffeeshop_by_id(shop_id):
     return {"Coffeeshop":newStore.get_coffeeshop_by_id(shop_id)}

    

