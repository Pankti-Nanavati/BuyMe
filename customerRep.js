const express =  require('express');

const app = express();

const routes = require('./routes')

const morgan = require('morgan');

const session = require('express-session')

const sessionStore = require('./config/sessionStore');

const customerRepPassport = require('./config/passportCRConfig');

require('dotenv').config();

const PORT = process.env.CUSTOMER_PORT;

// For Logging
app.use(morgan('dev'))

const customerRepSessionConfig = {
    secret: process.env.CUSTOMER_SECRET_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 3600000 1 hour in milliseconds. The expiration time of the cookie to set it as a persistent cookie.
      sameSite: true
    },
};

// Creating Session
app.use(session(customerRepSessionConfig));

// parse Json data
app.use(express.json());

// parse Form data
app.use(express.urlencoded({ extended: true }));

// Serve static Files
app.use(express.static(__dirname + '/views'));

// Set View Engine
app.set('view engine', 'ejs');


// Initialize Passport for admin
app.use(customerRepPassport.initialize());
app.use(customerRepPassport.session());

// Setting Routes
app.use(routes);

app.listen(PORT, console.log("Customer Server started at port: " + PORT));