# Universal Coffee Shop App 

 
 
## **Install commands (run in the terminal, DO THIS SECOND):**

### General installs (System wide)
###### - Have python installed on your device

### React Native Frontend (...\universal-coffee-shop\universal-coffee-shop)
###### **'npm install'**


<img width="436" height="25" alt="image" src="https://github.com/user-attachments/assets/09a0a031-1d7b-474c-89b0-0d4d5d69f396" />

### Python Backend (...\universal-coffee-shop\app)
###### **'pip install uvicorn'**
###### **'pip install fastapi'**
###### **'pip install python-dotenv'**
###### **'pip install requests'**
###### **'pip install jwt'**
###### **' pip install 'pydantic[email]' '**


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

## **Architecture Diagram**

<img width="1360" height="1920" alt="ReadMe_Architecture_Diagram(1)" src="https://github.com/user-attachments/assets/1c110cc8-abc8-40ff-b05e-6f7f77363652" />

### **Overview**
This diagram shows the architecture of the Universal Coffeeshop app mobile application using the FastAPI framework, Sqlite database, and React-Native frontend. We've divided it into three main sections: the Presentation Layer the Business/API layer, Persistance layer, and the database layer.

### Layers

Presentation Layer: React native frontend

Business layer/API layer: controll for API calls

Persistence Layer: Models for repository.

Database layer: SQLite Database

#### Presentation Layer
This is the top layer of the fastAPI project. It is made up of component parts of React-Native as well as javascript functions, including the fetchAPI for talking to fastAPI. It is responsible for the interactive UI that the user accesses. 

#### Business/API Layer
The Business/Api layer is the entrypoint from the frontend to the backed of the application. It contains the FastAPI endpoints that perform the actual business logic of the application. This includes Login, Receiving Forms, Auth Callbacks, and Managing Coffee Shop data. It also functions as the middleman between the Persistance layer and the client.

#### Persistance Layer
The persistence layer contains all the logic for our system models. It is responsible for talking to the Database layer.

#### Database Layer
This layer is responsible for storing all the data of the application. It is responsible for executing queries on the database, such as adding a new coffee shop or searching for a coffeeshop.
