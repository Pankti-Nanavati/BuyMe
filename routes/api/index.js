const {loginView, registerView, homepageView } = require('../../controllers/loginController');
const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/register', registerView);

router.get('/login', loginView);

// Todo 
router.get('/logout', );

router.get('/homepage', homepageView);

router.post('/login', passport.authenticate('local'), (req, res) => {
    
    if (res.status != 200) {
        return res.redirect('login');
    }

    return res.redirect('homepage');
});

router.post('/register', async (req, res) => {
    
    // TODO check if user already exists
    const body = req.body;

    if (res.status != 200) {
        return res.redirect('register');
    }
    // Redirect to Login Page on succesful registration
    return res.redirect('login');    

});


module.exports = router;


