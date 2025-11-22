from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import uuid, time, random
from models import provider
from pydantic import BaseModel, EmailStr
import databaseStuff.db_controller as db_controller
import string
import jwt


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

    class RegisterIn(BaseModel):
        name: str

        email: EmailStr
        password: str

    @router.post("/register")
    async def register_user(payload: RegisterIn):
        try:
            if not db.check_unique_username(payload.email):
                raise HTTPException(status_code=409, detail="Email already exists.")

            user_id = db.create_user(payload.email, payload.password, False)

            return {
                "ok": True,
                "user": {
                    "id": user_id,
                    "name": payload.name,
                    "email": payload.email,
                    "role": "USER"
                }
            }
        except:
            print("Error: Registration Operation Failed.")


    class LoginIn(BaseModel):
        email: EmailStr
        password: str


    @router.post("/login")
    async def login_user(payload: LoginIn):


        try:
            row = db.get_user_by_email(payload.email)
            if row is None:
                raise HTTPException(status_code=401, detail="Invalid email or password.")
            
            user_id, user_name, stored_pw, is_admin = row


            if str(stored_pw) != payload.password:
                raise HTTPException(status_code=401, detail="Invalid email or password.")


            mfa_enabled = False # i will put a logic on this later(enable or dissable MFA per user)
             # I dissabled it for now
            if mfa_enabled:
                code = f"{random.randint(0, 999999):06d}"
                challenge_id = str(uuid.uuid4())
                expires_at = int(time.time()) + 5 * 60  

                db.create_mfa_challenge(user_id, code, expires_at, challenge_id)


                print(f"[MFA] Code for {payload.email}: {code}")

                return {
                    "mfa_required": True,
                    "challenge_id": challenge_id,
                }



            return {"user_id": user_id}

        except HTTPException:
            raise
        except Exception as e:
            print("LOGIN_ERROR:", repr(e))  
            raise HTTPException(status_code=500, detail="Login failed.")
    class MFAStartOut(BaseModel):
        mfa_required: bool
        challenge_id: str | None = None



    class MFAVerifyIn(BaseModel):
        challenge_id: str
        code: str

    class MFAVerifyOut(BaseModel):
        token: str
        user_id: str
        is_admin: bool


    @router.post("/mfa/verify", response_model=MFAVerifyOut)
    async def verify_mfa(payload: MFAVerifyIn):

        try:
            row = db.get_mfa_challenge(payload.challenge_id)
            if row is None:
                raise HTTPException(status_code=400, detail="Invalid challenge.")
            
            challenge_id, user_id, code, expires_at, consumed = row

            now = int(time.time())
            if consumed or now > expires_at:

                raise HTTPException(status_code=400, detail="Code expired.")

            if payload.code != code:
                raise HTTPException(status_code=400, detail="Invalid code.")


            db.consume_mfa_challenge(challenge_id)


            token = str(uuid.uuid4())


            user_row = db.get_user_from_id(user_id) 
            if user_row is None:
                raise HTTPException(status_code=500, detail="User not found")


            _, _, _, is_admin = user_row

            return MFAVerifyOut(
                token=token,
                user_id=user_id,
                is_admin=bool(is_admin),
            )
        except:
            print("Error: MFA verification failed.")





    return router
