import requests

BACKEND_URL = "http://127.0.0.1:8000"

print("Testing getting store list")
print("No user login, request should return 401")
 
url = f'{BACKEND_URL}/home/get_all_coffeeshops'


resp = requests.get(url)

if resp.status_code == 401:
    print("Test succesfull 'status_code'="+str(resp.status_code))
else: 
    print("Test failed 'status_code'="+str(resp.status_code))

