const dotenv = require('dotenv');
const express =  require('express');
const app = express();
const routes = require('./routes')
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
const passport = require('passport')
const session = require('express-session')
const sessionStore = require('./config/sessionStore');
require('./config/passportConfig')(passport)

dotenv.config();

const PORT = process.env.PORT || 4000;

// For Logging
app.use(morgan('dev'))

// Setting express to parse Json / Cookie data
app.use(express.json());
app.use(cookieParser());

// Maintaining Session
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
  )

// Setting express to parse Form data
app.use(express.urlencoded({ extended: true }));

// Serving static Files
app.use(express.static(__dirname + '/views'));

// Setting View Engine
app.set('view engine', 'ejs');

// Initializing Passport
app.use(passport.initialize());
app.use(passport.session());


// Setting Routes
app.use(routes);

app.listen(PORT, console.log("Server started at port: " + PORT));


