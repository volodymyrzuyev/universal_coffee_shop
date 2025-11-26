from fastapi import APIRouter


#importing Store so it can be used to call the db methods instead of directly calling them through db
from models.object_types import Store


coffeeShopRouter = APIRouter(
    prefix='/home',
    tags=["Gets specific coffeeshop"])

#Store object that is created to call the methods in the database
newStore = Store()

#endpoint that returns all information from all coffeeshops
@coffeeShopRouter.get("/get_all_coffeeshops")
async def get_all_stores():
    return {"Coffeeshops": newStore.get_all()}

#endpoint that returns all information from a singular coffeeshop by its id
@coffeeShopRouter.get("/get_coffeeshop_by_id/{shop_id}")
async def get_coffeeshop_by_id(shop_id):
     return {"Coffeeshop":newStore.get_coffeeshop_by_id(shop_id)}

#endpoint that returns all coffeeshops that are named 'shop_name'
@coffeeShopRouter.get("/get_coffeeshop_by_name/{shop_name}")
async def get_coffeeshops_by_name(shop_name):
     return {"Coffeeshops":newStore.get_coffeeshop_by_name(shop_name)}

    

