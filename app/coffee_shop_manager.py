import databaseStuff.db_controller as db_controller
from fastapi import APIRouter, FastAPI
from routes import auth
from routes import form
from routes import user
from routes import coffeeShop
from models import provider
import os


def initAuthRoute(db: db_controller.DatabaseController) -> APIRouter:
    platform_providers: dict[str, provider.providers] = {}

    platform_providers["google"] = provider.Google(
        clientID=os.getenv("GOOGLE_CLIENT_ID"),
        clientSecret=os.getenv("GOOGLE_CLIENT_SECRET"),
        redirectURI=os.getenv("GOOGLE_REDIRECT"),
    )

    return auth.createAuthRouter(
        platform_providers,
        db,
        "super secret",
    )


class CoffeeShopManager:
    def __init__(self):
        self.db = db_controller.DatabaseController("db.db")
        self.db.database_connect()

        app = FastAPI()
        app.include_router(initAuthRoute(self.db))
        app.include_router(form.FormRouter)
        app.include_router(user.UserRouter)
        app.include_router(coffeeShop.coffeeShopRouter)

        self.app = app

    def _initProviders(self) -> dict[str, provider.providers]:
        return {}

