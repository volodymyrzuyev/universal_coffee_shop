import unittest

class TestRegister(unittest.TestCase):
    def test_register_user(self):
        import time
        import requests
        from app.models.object_types import User

        BACKEND_URL = "http://127.0.0.1:8000"
        url = f'{BACKEND_URL}/auth/register'

        payload = {
        "name": "testUser",
        "email": str(time.time())+"@gamiel.com",
        "password": "testing"
        }

        resp = requests.post(url, json=payload)

        self.assertEqual(resp.status_code, 200)
        self.assertIn('user', resp.json())

        

if __name__ == '__main__':
    unittest.main()