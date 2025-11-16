from fastapi import FastAPI
from routes import auth
from routes import form
from routes import user
from routes import coffeeShop

app = FastAPI()

app.include_router(auth.router)
app.include_router(form.FormRouter)
app.include_router(user.UserRouter)
app.include_router(coffeeShop.coffeeShopRouter)
