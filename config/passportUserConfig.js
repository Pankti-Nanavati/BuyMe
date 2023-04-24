const passport = require('passport');
const userPassport = new passport.Passport();
const User = require('../models/index').User;
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy


userPassport.serializeUser((user, done) => {
  let userType = null;
  userType = 'user';
  done(null, {user_name: user.user_name, id: user.email_id, type: userType});
});


userPassport.deserializeUser(async (idObj, done) => {
  try {
    const user = await User.selectOneById(idObj.id);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});


userPassport.use('user',
new LocalStrategy(
  { passReqToCallback: true,
    usernameField: 'email_id',
    passwordField: 'password',
  },
  async (req, email_id, password, done) => {
    if (!req.user && (!email_id === '' || password.length >= 5)) {
      try {
        const user = await User.selectOneById(email_id);
        if (!user) {
          console.log()
          return done(null, false, {
            message: `No email_id found that matches ${email_id}`
          });
        } else {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            delete user.password;
            done(null, user);
          } else {
            done(null, false, { message: 'incorrect password' });
          }
        }
      } catch (err) {
        done(err, null);
      }
    } else if (req.user) {
      done(null, req.user);
    } else {
      return done(null, false, {
        message: 'email_id and password must match input requirements'
      })
    }
  }));
  
  module.exports = userPassport;


  