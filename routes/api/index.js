const {loginView, registerView, homepageView } = require('../../controllers/loginController');
const User = require('../../models/User');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

router.get('/register', registerView);

router.get('/login', loginView);

// Todo 
router.get('/logout', (req, res) => {
    req.logout(() => {
        
    });
    
    return res.redirect('/');
});

router.get('/homepage', homepageView);

router.post('/login', passport.authenticate('local', {
    successRedirect: "homepage",
    failureRedirect: "login",
}));


// Add try catch 
router.post('/register', async (req, res) => {
    console.log('password', req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const email_id = req.body.email_id;
    const name = req.body.name;
    const address = req.body.address;
    const phone_number = req.body.phone_number;
    const user_name = req.body.user_name;
    
    User.selectOneById(email_id, (err, user) => {
        if (err) {
            console.log('error', err);
            return err; // if err return err
        } else if (user.length == 0) {
            User.insertOne([email_id, hashedPassword, name, user_name, phone_number, address], (err, user) => {
                if (err) {
                    throw err;
                }
                else return res.redirect('login');
            }); 
        } else {
            return res.redirect('register');
        }
    });  
});


module.exports = router;


