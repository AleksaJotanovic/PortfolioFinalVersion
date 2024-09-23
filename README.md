IMPORTANT! FOLLOW THE INSTRUCTIONS CAREFULLY:

1) Download & install MongoDB server: https://www.mongodb.com/try/download/community
2) Download & install MongoDB compass (if you haven't already installed it with the monogdb server): https://www.mongodb.com/try/download/compass
3) Before you do anything, make sure MongoDB is running in Windows Services.
4) Create new connection in MongoDB compass with this connection string: mongodb://127.0.0.1:27017/
5) In that connection, create a database called "alexitdb", and inside it create collections whose exported versions are located in the "collections" folder. First create a collection and then import the matching file from "collections". (eg. "alexitdb.products.json" must be imported in the newly created collection "products" and etc...)
6) Install Angular CLI by running command prompt (not as admin) and then run this command: npm i -g @angular/cli@18.0.6
7) Inside "alexit-backend" folder there is a file ".env" in which you have variable called "APP_PASSWORD". The value of that variable must be your App Password, which you will create here (remove spaces from the copied password): https://myaccount.google.com/apppasswords
8) After 7th step, in same that ".env" file, you have variable APP_EMAIL in which you just have to put your gmail address. (gmail address of the google account you used to create the App Password)
9) Inside "alexit-backend" run the command "npm i". Do the same in "alexit-frontend".
10) To run my project, inside "alexit-backend" run the command: "npm start", and in "alexit-frontend" run "ng serve -o".
11) To access the admin side of the site just add "/admin" in the url bar (http://localhost:4200/admin), and then sign in with:
    - Email: matthewsanders077@gmail.com
    - Password: simplepassword
12) Enjoy :)
