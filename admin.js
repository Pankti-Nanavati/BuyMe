const express =  require('express');

const app = express();

const routes = require('./routes')

const morgan = require('morgan');

const session = require('express-session')

const sessionStore = require('./config/sessionStore');

const adminPassport = require('./config/passportAdminConfig');

require('dotenv').config();

const PORT = process.env.ADMIN_PORT;

// For Logging
app.use(morgan('dev'))

const adminSessionConfig = {
  secret: process.env.ADMIN_SECRET_KEY,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 3600000, // 1 hour
    sameSite: true
  },
};

// Creating Session
app.use(session(adminSessionConfig));

// parse Json data
app.use(express.json());

// parse Form data
app.use(express.urlencoded({ extended: true }));

// Serve static Files
app.use(express.static(__dirname + '/views'));

// Set View Engine
app.set('view engine', 'ejs');


// Initialize Passport for admin
app.use(adminPassport.initialize());
app.use(adminPassport.session());

// Setting Routes
app.use(routes);

app.listen(PORT, console.log("Admin Server started at port: " + PORT));