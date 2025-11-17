import app.databaseStuff.db_controller as db_controller


class CoffeeShopManager:


    def __init__(self):
        self.db = db_controller.DatabaseController("db.db")
        self.db.database_connect()
        self._run_api()

    def _run_api(self):
        pass

#This needs to be an abstract base class. Do this later or whatever
#and then remember we also need to have the actual classes for Auth, Form, User, and Coffeeshop
class API():
        pass