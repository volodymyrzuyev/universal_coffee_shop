import time
import requests

BACKEND_URL = "http://127.0.0.1:8000"

print("Testing acessing /auth/register")
print("Since middleware should ignore /auth/ this should be a 200")
 
url = f'{BACKEND_URL}/auth/register'

payload = {
    "name": "testUser",
    "email": str(time.time())+"@gamiel.com",
    "password": "testing"
}

resp = requests.post(url, json=payload)


if resp.status_code == 200:
    print("Test succesfull 'status_code'="+str(resp.status_code))
else: 
    print("Test failed 'status_code'="+str(resp.status_code))

