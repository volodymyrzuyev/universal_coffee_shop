import jwt
import requests

BACKEND_URL = "http://127.0.0.1:8000"

print("Testing getting store list")
print("Since user is logged in, 200 should be returned, and current stores in the db are returned")
 
url = f'{BACKEND_URL}/home/get_all_coffeeshops'

secretKey = "super secret"

custom_headers = {
    'User-Agent': 'My-Python-Script/1.0',
    'Accept': 'application/json',
    'Authorization': f'Bearer {jwt.encode({"id": "test user"}, secretKey, algorithm="HS256")}'
}

resp = requests.get(url, headers=custom_headers)

if resp.status_code == 200:
    print("Test succesfull 'status_code'="+str(resp.status_code))
    print("Current stores")
    print(resp.json())
else: 
    print("Test failed 'status_code'="+str(resp.status_code))