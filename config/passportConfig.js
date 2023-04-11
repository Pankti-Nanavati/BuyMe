const User = require('../models/index').User;
const Admin = require('../models/index').Admin;
const CustomerRep = require('../models/index').CustomerRep;
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

module.exports = passport => {
  
  passport.serializeUser((user, done) => {
    let userType = null;
    if (Object.getPrototypeOf(user) === Admin.prototype) {
      userType = 'admin';
    } else if (Object.getPrototypeOf(user) === CustomerRep.prototype) {
      userType = 'customer';
    } else {
      userType = 'user';
    }
    done(null, {id: user.email_id, type: userType});
  });
  
  
  passport.deserializeUser(async (idObj, done) => {
    try {
      let user = null;
      if (idObj.type === 'admin') {
        user = await Admin.selectOneById(idObj.id);
      } else if (idObj.type === 'customer') {
        user = await CustomerRep.selectOneById(idObj.id);
      } else {
        user = await User.selectOneById(idObj.id);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  
  passport.use('user',
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
          console.log('Authenticated via session', req.user);
          done(null, req.user);
        } else {
          return done(null, false, {
            message: 'email_id and password must match input requirements'
          })
        }
      }
    )
  );

  passport.use('admin', 
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email_id',
        passwordField: 'password', 
      }, 
      async (req, email_id, password, done) => {
        try {
          const user = await Admin.selectOneById(email_id);

          if (!user || !user.isAdmin || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Incorrect email or password' });
          }
          return done(null, user);  
        } catch (err) {
          return done(err);
        }
    }
  ));
      
  passport.use('customer', 
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email_id',
        passwordField: 'password'
      }, 
      async (req, email_id, password, done) => {
        try {
          const user = await CustomerRep.selectOneById(email_id);
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

};
