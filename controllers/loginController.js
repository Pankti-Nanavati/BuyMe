//js
const User = require('../models/User');

const registerUser = (values) => {
    // Get user
    User.selectOneById(values[0], (result) => {
        if (result.length == 0){
            User.insertOne(values, (result) => {
                return result;
            });
        } else throw new Error('User Already Exists');
    })};

//For Register Page
const registerView = (req, res) => {
    res.render("../views/static/register", {
    } );
};

// For Login Page
const loginView = (req, res) => {
    res.render("../views/static/login", {
    } );
};

const homepageView = (req, res) => {
    res.render("../views/static/homepage.ejs", {
    } );
}



module.exports =  {
    registerView,
    loginView,
    homepageView,
    registerUser,
};