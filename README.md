
# Alexit Portfolio

## Introduction
Welcome to **Alexit Portfolio**, a full-stack project built using Angular (frontend) and Node.js (backend) with MongoDB as the database. Follow the steps below to set up and run the project on your local machine.

## Prerequisites
- **MongoDB Server**
- **MongoDB Compass**
- **Node.js**
- **Angular CLI**

## Project Setup

### 1. Install MongoDB
- [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) and install it.
- [Download MongoDB Compass](https://www.mongodb.com/try/download/compass) and install it if it wasn’t included in the MongoDB Server installation.

### 2. Start MongoDB Service
Make sure MongoDB is running by checking the Windows Services.

### 3. Connect to MongoDB via MongoDB Compass
1. Open MongoDB Compass.
2. Create a new connection using the following connection string:
   ```
   mongodb://127.0.0.1:27017/
   ```
3. In the connection, create a new database called `alexitdb`.

### 4. Create and Import Collections
Inside the `collections` folder of this project, you will find JSON files for each collection. For each collection:
1. Create the collection in MongoDB (e.g., `products`).
2. Import the corresponding JSON file (e.g., `alexitdb.products.json` for the `products` collection).

### 5. Install Angular CLI
Run the following command in your terminal (non-admin):
```
npm i -g @angular/cli@18.0.6
```

### 6. Setup Backend Configuration
Inside the `alexit-backend` folder, open the `.env` file and configure the following:
- `APP_PASSWORD`: Create an [App Password](https://myaccount.google.com/apppasswords) for your Gmail account and paste it here (remove any spaces from the copied password).
- `APP_EMAIL`: Enter your Gmail address, the same account used to create the App Password.

### 7. Install Dependencies
Navigate to both `alexit-backend` and `alexit-frontend` folders, and run the following command in each:
```
npm i
```

### 8. Running the Project
- To start the backend, navigate to the `alexit-backend` folder and run:
  ```
  npm start
  ```
- To start the frontend, navigate to the `alexit-frontend` folder and run:
  ```
  ng serve -o
  ```

### 9. Access the Admin Dashboard
Once both the backend and frontend are running, open a browser and go to:
```
http://localhost:4200/admin
```
Use the following credentials to log in:
- **Email:** matthewsanders077@gmail.com
- **Password:** simplepassword

Enjoy! :)

