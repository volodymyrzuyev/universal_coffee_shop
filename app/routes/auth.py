from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
import databaseStuff.db_controller as db_controller
import random
import string
import jwt

from models import provider

load_dotenv()


def createAuthRouter(
    providers: dict[str, provider.providers],
    db: db_controller.DatabaseController,
    secretKey: str,
) -> APIRouter:
    router = APIRouter(
        prefix="/auth",
        tags=["auth"],
        responses={404: {"description": "invalid location"}},
    )

    @router.get("/login/{provider}/")
    async def login(provider):
        return RedirectResponse(providers[provider].getAuthUrl())

    @router.get("/callback/{provider}")
    async def callback(provider: str, code: str):
        token = providers[provider].callback(code)
        userID = db.get_user_id_from_token(token, provider)
        if userID is None:
            username = "".join(
                random.choices(string.ascii_letters + string.digits, k=20)
            )
            password = "".join(
                random.choices(string.ascii_letters + string.digits, k=20)
            )
            userID = db.create_user(username, password, False)
            db.add_user_id_to_token(token, provider, userID)

        internalJWT = jwt.encode({"id": userID}, secretKey, algorithm="HS256")

        return {"status": "success", "jwt": internalJWT}

    return router
