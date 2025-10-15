from abc import ABC, abstractmethod

from app.models.authProvider import AuthProvider


# auth provider interface
class Provider(ABC):

    def __init__(self, token: str):
        self.token = token

    @abstractmethod
    def getAuthUrl(self):
        pass

    def getToken(self) -> str:
        return self.token


class Apple(Provider, AuthProvider):
    pass


class Google(Provider, AuthProvider):
    pass


class Facebook(Provider, AuthProvider):
    pass
