const User = require('../models/userPassport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

console.log('MODULE', User);
module.exports = passport => {
    passport.serializeUser((user, done) => {
      done(null, user.email_id)
    })
    passport.deserializeUser((id, done) => {
      User.getUserById(id, (err, data) => {
        done(err, data)
      })
    })
    passport.use(
      new LocalStrategy(
        { passReqToCallback: true,
            usernameField: 'email_id',
            passwordField: 'password',
        },
        (req, email_id, password, done) => {
          console.log('**request', req); 
          console.log('req.user', req.body);
          console.log('req.user', req.user);
          if (!req.user && (!email_id === '' || password.length >= 5)) {
            User.getUserById(email_id, (err, user) => {
              console.log('userobj', user);
              if (err) {
                console.log(err);
                return done(err) // if err return err
              } else if (!user) {
                return done(null, false, {
                  message: `No email_id found that matches ${email_id}`
                })
              } else {

                bcrypt.compare(password, user.password, (err, result) => {
                  if (err) {
                    done(err)
                  } else if (result) {
                    delete user.password
                    done(null, user)
                  } else {
                    done(null, false, { message: 'incorrect password' })
                  }
                })
              }
            })
          } else if (req.user) {
            done(null, req.user)
          } else {
            return done(null, false, {
              message: 'email_id and password must match input requirements'
            })
          }
        }
      )
    )
  }