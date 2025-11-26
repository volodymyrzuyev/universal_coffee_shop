from abc import ABC, abstractmethod
from databaseStuff.config import db
from typing import List

class StoredObject(ABC):
    
    @abstractmethod
    def get_by_id(self, id, database):
        pass

    @abstractmethod
    def get_all(self, database):
        pass

class Store(StoredObject):
    
    def get_by_id(self, id) -> tuple:
        return db.get_store_by_id(id)
    
    def get_all(self) -> List[tuple]:
        return db.get_all_stores()
    
    #this returns all information about a coffeeshop based on its ID 
    def get_coffeeshop_by_id(self,shop_id):
         return db.get_coffeeshop_by_id(shop_id)
    
    #this returns all information about a coffeeshop based on its name
    def get_coffeeshop_by_name(self, shop_name):
        return db.get_coffeeshop_by_name(shop_name)

    def add(self, coffee_shop_name: str, owner_id: str, street_address: str, city: str, state: str, phone_number: int, logo_url: str) ->str:
        """
        Creates a coffee shop and returns the unique ID as a string.
        """
        return db.create_coffee_shop(coffee_shop_name, owner_id, street_address, city, state, phone_number, logo_url)
    
    def add_menu_item(self, store_id: str, item_name:str, item_price: float, picture_url:str)-> None:
        db.add_menu_item(store_id, item_name, item_price, picture_url)

    def remove_menu_item(self, store_id:str, item_name:str) ->None:
        db.remove_menu_item(store_id, item_name)

class User(StoredObject):
    def get_by_id(self, id) -> tuple:
        return db.get_user_from_id(id)

    def get_by_email(self, email: str) -> tuple:
        return db.get_user_by_email(email)

    def get_all(self) -> List[tuple]:
        return db.get_all_users()

    def check_unique_username(self, user_name: str) -> bool:
        return db.check_unique_username()

    @abstractmethod
    def add(self, user_id: str, user_name: str, password: str) -> None:
        pass

    def set_contact_info(self, user_id: str, email: str, phone_number: str) -> None:
        db.set_contact_info(user_id, email, phone_number)


class StandardUser(User):

    def get_all(self):
        return db.get_standard_users()

    def add(self, user_name: str, password: str) -> str:
        return db.create_user(user_name, password, False)

class AdminUser(User):

    def get_all(self):
        return db.get_admin_users()

    def add(self, user_name: str, password: str) -> str:
        return db.create_user(user_name, password, True)