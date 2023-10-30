const passport = require('passport');
const adminPassport = new passport.Passport();
const Admin = require('../models/index').Admin;
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


adminPassport.serializeUser((user, done) => {
    const userType = 'admin';
    done(null, {id: user.email_id, type: userType});
});

adminPassport.deserializeUser(async (idObj, done) => {
    try {
        const admin = await Admin.selectOneById(idObj.id);
        done(null, admin);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});


adminPassport.use('admin',
new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: 'email_id',
        passwordField: 'password',
    },
    async (req, email_id, password, done) => {
        try {
            const admin = await Admin.selectOneById(email_id);
            if (!admin) {
                return done(null, false, { message: 'Incorrect email' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            return done(null, admin);
        } catch (err) {
            console.log(err);
            return done(err);
        }
    }));
module.exports = adminPassport;