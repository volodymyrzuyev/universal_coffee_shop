from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
from starlette.responses import JSONResponse
from starlette import status

secretKey = ""

class Persistance(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        auth_header = request.headers.get("Authorization")
        bearer_token = None

        if request.url.path.startswith("/auth/"):
            if auth_header and auth_header.startswith("Bearer "):
                bearer_token = auth_header.split(" ", 1)[1]
                print(bearer_token)

            response = await call_next(request)
            return response

        if request.url.path.startswith("/docs"):
            response = await call_next(request)
            return response

        if request.url.path.startswith("/openapi.json"):
            response = await call_next(request)
            return response

        if auth_header and auth_header.startswith("Bearer "):
            bearer_token = auth_header.split(" ", 1)[1]
            try:
                decoded_payload = jwt.decode(
                    bearer_token,
                    secretKey,
                    algorithms=["HS256"]
                )
                request.state.user_id = decoded_payload["id"]

            except:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "You are not logged In"}
                )

        else:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "You are not logged In"}
            )

        response = await call_next(request)
        return response
