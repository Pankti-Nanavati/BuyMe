const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  createDatabaseTable: true,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 7200000
};

const sessionStore = new MySQLStore(sessionOptions);

module.exports = sessionStore;