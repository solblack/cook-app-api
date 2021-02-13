# COOK APP API

This is the API for the COOK APP project, an app where you can create and save recipes, plan meals and make shoppings lists.

This project uses a MySQL database and it's developed using NodeJS and Express.

## Installation

Download this repository and run npm install to install the project's dependencies.

```
git clone git@github.com:solblack/cook-app-api.git
cd cook-app-api
npm install

```
Then, you need to configure the .env file. Use the .env.example file as an example to create a .env file on the project's root folder

Use the SQL file inside the "database" folder to import the project's database on your local MYSQL server

After you have configured the .env file and imported the database, you are ready to start the server running npm run start:dev on your terminal

```
npm run start:dev
```

The server will be running on http://localhost:3000 (unless you set a different port on your .env file)

