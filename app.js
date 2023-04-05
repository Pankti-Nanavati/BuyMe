const express =  require('express');

const app = express();

const routes = require('./routes')

const morgan = require('morgan');

const passport = require('passport')

const session = require('express-session')

const sessionStore = require('./config/sessionStore');

require('./config/passportConfig')(passport)

require('dotenv').config()

const PORT = process.env.PORT || 4000;

// For Logging
app.use(morgan('dev'))


// Creating Session
app.use(
    session({
      secret: process.env.SECRET_KEY,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 3600000 1 hour in milliseconds. The expiration time of the cookie to set it as a persistent cookie.
        sameSite: true
      }
    })
);


// parse Json data
app.use(express.json());

// parse Form data
app.use(express.urlencoded({ extended: true }));

// Serve static Files
app.use(express.static(__dirname + '/views'));

// Set View Engine
app.set('view engine', 'ejs');

// Initialize Passport
app.use(passport.initialize());

app.use(passport.session());

// Setting Routes
app.use(routes);

app.listen(PORT, console.log("Server started at port: " + PORT));


