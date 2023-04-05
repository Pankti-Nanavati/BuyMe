const User = require('../models/userPassport');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

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
        if (!req.user && (!email_id === '' || password.length >= 5)) {
          User.getUserById(email_id, (err, user) => {
            if (err) {
              return done(err) // if err return err
            } else if (!user) {
              return done(null, false, {
                message: `No email_id found that matches ${email_id}`
              })
            } else {
              
              bcrypt.compare(password, user.password, async (err, result) => {
                
                let hashp = await bcrypt.hash(password, 10);
                
                console.log('Comparison', hashp, user.password);
                
                if (err) {
                  console.log('inside err');
                  done(err)
                } else if (result) {
                  delete user.password
                  done(null, user)
                } else {
                  console.log('incorrect password');
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