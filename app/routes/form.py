from fastapi import APIRouter
from pydantic import BaseModel
from databaseStuff.config import db


FormRouter = APIRouter(tags=["Coffeeshop Form Submission"])


class CoffeeShop(BaseModel):
    coffeeShopName: str
    OwnerID: str
    streetAddress: str
    city: str
    state: str
    PhoneNum: str
    shopURL: str



@FormRouter.post("/recieveForm/")
async def getForm(CS: CoffeeShop):

    storeName = db.get_store_by_name(CS.coffeeShopName)

    db.create_coffee_shop(
            CS.coffeeShopName,
            CS.OwnerID,
            CS.streetAddress,
            CS.city,
            CS.state,
            int(CS.PhoneNum.replace("-", "")),
            CS.shopURL)

    return {"storeName":storeName}
