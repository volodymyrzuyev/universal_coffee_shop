from fastapi import FastAPI
from routes import auth
from routes import form

app = FastAPI()

app.include_router(auth.router)
app.include_router(form.router)
