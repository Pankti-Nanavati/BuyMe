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
            const existingUser = await User.selectOneById(email_id);
            
            if (existingUser) {
                return res.redirect('register');
            }
            
            await User.insertOne(values);
            return res.redirect('/');
            
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    },

    getProfile: async (req, res) => {  
        const id = req.session.passport.user.id;
        const user = await User.selectOneById(id);
        return res.render('../views/static/profile.ejs', user);
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
        if (req.session.passport){
            return res.redirect('homepage');
        }
        else return res.render("../views/static/login", {
        });
    },

    queryView: (req, res) => {
        const data = {user_name: req.session.passport.user.user_name};
        return res.render('../views/static/questions.ejs', data);
    },

    homepageView: (req, res) => {
        const data = {user_name: req.session.passport.user.user_name};  
        res.render("../views/static/homepage", data);
    },    

    fetchAlert: async (req, res) => {
        try{
            const alerts = await User.fetchAlertForUser(req.session.passport.user.id);
            const data = {user_name: req.session.passport.user.user_name, alerts: alerts};
            return res.json(data);
        }
        catch (err){
            return res.status(500).send('Internal Server Error');
        }

    },

    raiseQuery: async(req, res) => {
        try{
            const queryType = req.body.queryType;
            const id = req.session.passport.user.id;
            let hashedPassword, value = req.body.value;
            if (queryType == 'Reset Password') {
                hashedPassword = await bcrypt.hash(req.body.value, 10);
                value = hashedPassword;
            }
            const result = await User.raiseQuery(id, queryType, value);
            return res.json(result);
        }
        catch (err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
    },

    setAlert: async (req, res) => {
        try{
            const productId = req.body.productId;
            const color = req.body.color;
            const size = req.body.size;
            const email_id = req.session.passport.user.id;
            const result = await User.setAlertForProductName(productId, color, size, email_id);
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
    },

    auctionHistory: async (req, res) => {
        try{
            console.log(req.session);
            const email_id = req.session.passport.user.id;
            const result = await User.fetchHistoryAuctionsForUser(email_id);
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }        
    },

    bidHistory: async (req, res) => {
        try{
            const email_id = req.session.passport.user.id;  
            const result = await User.fetchHistoryBidsForUser(email_id);
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }        
    },

    postQuestion: async(req, res) => {
        try{
            const email_id = req.session.passport.user.id;
            const query = req.body.query;  
            const result = await User.askQuestion(email_id, query);
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }        
    }

};

module.exports = loginController;