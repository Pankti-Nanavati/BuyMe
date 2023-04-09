const User = require('../models/User');
const bcrypt = require('bcrypt');


const loginController = {

    login: async (req, res) => {
        if (req.user) {
            return res.redirect('homepage');
        }
        else {
            return res.redirect('login');
        }
    },

    registerUser: async (req, res) => {
    
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const email_id = req.body.email_id;
            const name = req.body.name;
            const address = req.body.address;
            const phone_number = req.body.phone_number;
            const user_name = req.body.user_name;
            
            const values = [email_id, hashedPassword, name, user_name, phone_number, address];
            
            // Check if user with the given email already exists
            User.selectOneById(email_id, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                
                if (result) {
                    return res.redirect('register');
                }
                
                User.insertOne(values, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    
                    return res.redirect('/');
                });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    },

    logoutUser: (req, res) => {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    },

    registerView: (req, res) => {
        res.render("../views/static/register", {
        });
    },

    loginView:  (req, res) => {
        res.render("../views/static/login", {
        });
    },

    homepageView: (req, res) => {
        res.render("../views/static/homepage.ejs", {
        });
    },    
};

module.exports = loginController;