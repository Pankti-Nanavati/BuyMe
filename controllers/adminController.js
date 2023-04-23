const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const adminController = {
    loginView: async (req, res) => {
        res.render('../views/static/admin.ejs');
    },

    homepageView: async (req, res) => {
        res.render('../views/static/adminHomepage.ejs');
    },

    crView: async (req, res) => {
        res.render('../views/static/createCustomerRep.ejs');
    },
    
    login: async(req, res) => {
        console.log(req.session);
        if (req.session.passport.user.type === 'admin'){
            return res.redirect('homepage');
        } else {
            return res.redirect('login');
        }
    },

    logout: async(req, res) => {
        req.session.destroy();
        req.logout();
        res.redirect('/admin');
    },

    
    createCR: async(req, res) => {
        try {
            const values = [req.body.email, await bcrypt.hash(req.body.password, 10), req.body.name, req.body.user_name, req.body.phone_number];
            const result = await Admin.insertOneCR(values);
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
};

module.exports = adminController;



