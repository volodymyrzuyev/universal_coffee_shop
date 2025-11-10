from fastapi import FastAPI
from routes import auth
from routes import form


def main():
    app = FastAPI()

    app.include_router(auth.router)
    app.include_router(form.router)

if __name__ == "__main__":
    main()