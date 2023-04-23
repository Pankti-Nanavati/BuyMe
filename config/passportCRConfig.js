const passport = require('passport');
const customerRepPassport = new passport.Passport();
const CustomerRep = require('../models/index').CustomerRep;
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


customerRepPassport.serializeUser((user, done) => {
    let userType = null;
    userType = 'customer';
    done(null, {id: user.email_id, type: userType});
});


customerRepPassport.deserializeUser(async (idObj, done) => {
    try {
        console.log('Inside customer Rep', idObj);
        const customer = await CustomerRep.selectOneById(idObj.id);
        done(null, customer);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});


customerRepPassport.use('customer',
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
    }));
    module.exports = customerRepPassport;
    