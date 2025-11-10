from abc import ABC, abstractmethod
from db_controller import DatabaseController as db 

class StoredObject(ABC):
    
    @abstractmethod
    def get_by_id(self, id, database):
        pass

    @abstractmethod
    def get_all(self, database):
        pass

class Store(StoredObject):
    
    def get_by_id(self, id, database: db):
        return database.get_store_by_id(id)
    
    def get_all(self, id, database: db):
        # ToDo: Call DB method to get all stores.
        pass

class User(ABC, StoredObject):
    def get_by_id(self, id, database: db):
        database.get_user_from_id(id)

    @abstractmethod
    def get_all(self, database):
        pass

class StandardUser(User):
    
    def get_all(self, database):
        # ToDo: Call DB method to get all Standard Users.
        pass

class AdminUser(User):

    def get_all(self, database):
        # ToDo: Call DB method to get all Admin Users.
        pass

