const User = require('../models/User');
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

module.exports = passport => {
  
  passport.serializeUser((user, done) => {
    done(null, user.email_id)
  })
  
  passport.deserializeUser(async (id, done) => {
    try {
      const data = await User.selectOneById(id);
      done(null, data);
    } catch (err) {
      done(err, null);
    }
  })
  
  passport.use(
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
              return done(null, false, {
                message: `No email_id found that matches ${email_id}`
              });
            } else {
              const result = await bcrypt.compare(password, user.password);
              let hashp = await bcrypt.hash(password, 10);
              console.log('Comparison', hashp, user.password);
              if (result) {
                delete user.password
                done(null, user)
              } else {
                console.log('incorrect password');
                done(null, false, { message: 'incorrect password' })
              }
            }
          } catch (err) {
            done(err, null);
          }
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
    