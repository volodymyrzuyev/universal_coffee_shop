import databaseStuff.db_controller as db_controller
from fastapi import APIRouter, FastAPI
from routes import auth
from routes import form
from routes import user
from routes import coffeeShop
from models import provider
import os


#added this in order to stop recieving the CORS error
#I believe this will allow the backend to trust the frontend origin (http://localhost:8081)
from fastapi.middleware.cors import CORSMiddleware


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

        #fastAPI website says that using * is a bad thing since it won;t
        #allow communication that uses credentials like cookies and 
        #authorization headers, but that shouldn't be an issue since all
        #were doing is sending data to the database
        origins = ['*']

        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self.app = app

    def _initProviders(self) -> dict[str, provider.providers]:
        return {}

