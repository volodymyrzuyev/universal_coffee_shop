from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from config import db

from models import provider

router = APIRouter(tags=["Coffeeshop Form Submission"])


class CoffeeShop(BaseModel):
    coffeeShopName: str
    OwnerID: str
    streetAddress: str
    city: str
    state: str
    PhoneNum: str


@router.post("/items/")
async def getForm(CS: CoffeeShop):
    return {
        "status": "success",
        "storeID": db.create_coffee_shop(
            CS.coffeeShopName,
            CS.OwnerID,
            CS.streetAddress,
            CS.city,
            CS.state,
            int(CS.PhoneNum.replace("-", "")),
        ),
    }

