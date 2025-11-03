from fastapi import FastAPI
from routes import auth

#test
app = FastAPI()

app.include_router(auth.router)
