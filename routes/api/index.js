const {loginView, registerView, homepageView, registerUser, logoutUser } = require('../../controllers/loginController');
const search = require('../../controllers/searchController');
const express = require('express');
const router = express.Router();
const passport = require('passport');



/** 
 * 
 * Login / Register / Logout API's
 * 
 * GET  /register -> Fetches Register page
 * GET  /login    -> Fetches Login page
 * GET  /logout   -> Clears session & Redirects to login page
 * POST /register -> Creates a new user & redirects to login page
 * POST /login    -> Fetches Homepage
 * */ 
 
router.get('/register', registerView);

router.get('/login', loginView);

router.get('/logout', logoutUser);

router.get('/homepage', homepageView);

router.post('/login', passport.authenticate('local', {
    successRedirect: "homepage",
    failureRedirect: "login",
}));

router.post('/register', registerUser);


/**
 * Product Search API
 * 
 * GET /category -> Fetches All available categories
 * GET /category/:id/subcategory -> Fetches all subcategories
 * GET /subcategory/:sc_id -> Fetches products in subcategory (Add pagination)
 * GET /product -> Fetch products (Add pagination)
 * GET /product/:id -> Fetch product by ID
 * POST /:scId/product/filter -> Filter products by scId & filters
 */

router.get('/category', search.categories);

router.get('/category/:categoryId/subcategories', search.subCategories);

router.get('/subcategory/:categoryId/products', search.productsByCategoryId);

router.post('/subcategory/:categoryId/products/filter', search.productsByFilter);

router.get('/products', search.products);

router.get('/product/:productId', search.productById);



/**
 * 
 * Auction / Bid API
 * 
 * GET - /bidHistory - get all past bids for userId 
 * GET - /auctionHistory - get all past auctions of userId
 * GET - /auctions - get active auctions             
 * POST - /createAuction     
 * POST - /placeBid/:productId
 * 
 */

module.exports = router;


