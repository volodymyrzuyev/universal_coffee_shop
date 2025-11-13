# Universal Coffee Shop App 

 
 
## **Install commands (run in the terminal, DO THIS SECOND):**

### General installs (System wide)
###### - Have python installed on your device

### React Native Frontend (...\universal-coffee-shop\universal-coffee-shop)
###### **'npm install'**
###### **'npm install bootstrap'**

<img width="436" height="25" alt="image" src="https://github.com/user-attachments/assets/09a0a031-1d7b-474c-89b0-0d4d5d69f396" />

### Python Backend (...\universal-coffee-shop\app)
###### **'pip install uvicorn'**
###### **'pip install fastapi'**
###### **'pip install python-dotenv'**
###### **'pip install requests'**
###### **'pip install jwt'**


## **Running a virtual Python Environment (DO THIS FIRST)**

In the terminal, in '....\Universal-Coffee-Shop' run:

###### 1. **'python -m venv venv'**

###### 2. **'venv\Scripts\activate'**

##### Should look like this when done: 

<img width="665" height="32" alt="image" src="https://github.com/user-attachments/assets/6930044b-3d7d-4eeb-9d26-9ba186130832" />


## **Running the app (DO THIS THIRD)**
###### 1. Open two terminals (one for frontend, one for backend)
###### 2. In the first terminal run **'venv\Scripts\activate'** if venv isn't appearing on the left in green
###### 3. Type **'cd universal-coffee-shop'**
###### 4. Type **'npx expo start'**
###### 5. Go back one directory with **'cd ..'**
###### 6. Type **'cd app'**
###### 7. Type **'uvicorn main:app --host 0.0.0.0 --port 8080'** and the server should be running
###### 8. Now you should have a fully working frontend in one terminal and fully working backend in the other terminal
