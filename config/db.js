require("dotenv").config();

const mysql = require("mysql2");


const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;


// Creating DB connection - replace values in .env file according to your db setup

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

db.connect(function(err){
  if(!!err){
      console.log(err)
  }
  else{
      console.log('MySQL connection succesful')
  }
})

module.exports = db;

