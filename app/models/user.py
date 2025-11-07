from abc import ABC, abstractmethod
from models.authProvider import AuthProvider


class Person(ABC,AuthProvider):
    def __init__(self, username, database):
        self.username = username
        self.database = database

    def callback(self):
        pass
    
    def addAuthProvider(token):
        pass

    @abstractmethod
    def testAbstract():
        pass


class StandardUser(Person):
    def __init__(self):
        pass
    def testAbstract():
        return "test"

class AdminUser(Person):
    def __init__(self):
        pass

    def testAbstract():
        return 1001


        
    
