import db_controller


class CoffeeShopManager:

    def __init__(self):
        self.db = db_controller.DatabaseController("db.db")
        self.db.database_connect()
        self._run_api()

    def _run_api(self):
        pass