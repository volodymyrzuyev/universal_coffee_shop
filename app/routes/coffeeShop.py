from fastapi import APIRouter


#importing Store so it can be used to call the db methods instead of directly calling them through db
from databaseStuff import db_controller
from models.object_types import Store


def initStoreRouter(db: db_controller.DatabaseController) -> APIRouter:
    coffeeShopRouter = APIRouter(
        prefix='/home',
        tags=["Gets specific coffeeshop"])

    #Store object that is created to call the methods in the database
    newStore = Store()
    #endpoint that returns all information from all coffeeshops
    @coffeeShopRouter.get("/get_all_coffeeshops")
    async def get_all_stores():
        return {"Coffeeshops": newStore.get_all()}

    #endpoint that returns all information from all coffeeshops
    @coffeeShopRouter.get("/shop/{store_id}/")
    async def get_all_reviews(store_id):
        data = db.get_store_reviews(store_id)
        print(data)

        return {"reviews": data}

    @coffeeShopRouter.get("/get_shops_admin_owns/{admin_id}")
    async def get_shops_admin_owns(admin_id):
         print(admin_id)
         return {"Admin_Coffeeshops": newStore.get_shops_admin_owns(admin_id)}

    
    #endpoint that returns all information from a singular coffeeshop by its id
    @coffeeShopRouter.get("/get_coffeeshop_by_id/{shop_id}")
    async def get_coffeeshop_by_id(shop_id):
         return {"Coffeeshop":newStore.get_coffeeshop_by_id(shop_id)}

    #endpoint that returns all coffeeshops that are named 'shop_name'
    @coffeeShopRouter.get("/get_coffeeshop_by_name/{shop_name}")
    async def get_coffeeshops_by_name(shop_name):
         return {"Coffeeshops":newStore.get_coffeeshop_by_name(shop_name)}

    return coffeeShopRouter

