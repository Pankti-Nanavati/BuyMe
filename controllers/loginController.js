//js

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
    homepageView
};