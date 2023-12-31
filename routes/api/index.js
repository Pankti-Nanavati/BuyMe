const express = require('express');
const router = express.Router();
const multer = require('multer');

const userPassport = require('../../config/passportUserConfig');
const adminPassport = require('../../config/passportAdminConfig');
const customerRepPassport = require('../../config/passportCRConfig');

const loginController = require('../../controllers/loginController')
const searchController = require('../../controllers/searchController');
const auctionController = require('../../controllers/auctionController');
const adminController = require('../../controllers/adminController');
const customerRepController = require('../../controllers/customerRepController');
const storage = require('../../config/multerConfig');

const upload = multer({
    storage: storage
  });
  
/**
 * 
 * Admin API's 
 * 
 * GET /admin/login - Fetch login page
 * POST /admin/login - Redirect to admin Homepage / Dashboard
 * GET /admin/logout - Flush session and redirect to login page
 * POST /admin/create/cr - To create a Customer Rep | body - {}
 */

router.get('/admin/login', adminController.loginView); 
router.post('/admin/login', adminPassport.authenticate('admin'), adminController.login); 
router.get('/admin/logout', adminController.logout);
router.get('/admin/homepage', adminController.homepageView);

router.get('/admin/create/cr', adminController.crView);
router.post('/admin/create/cr', adminController.createCR);

router.get('/admin/create/report', adminController.reportView);
router.post('/admin/create/report', adminController.createReport);



/**
 * 
 * Customer Representative API's
 * 
 * GET /customerRep/login  - Fetch Login Page
 * POST /customerRep/login - Redirect to Customer Rep Dashboard
 * GET /customerRep/logout - Flush session and redirect to login page
 * GET /customerRep/queries - Fetch list of User Queries
 * POST /customerRep/queries/resolve - Resolve Query 
 */

router.get('/customerRep/login', customerRepController.loginView);
router.post('/customerRep/login', customerRepPassport.authenticate('customer'), customerRepController.login);
router.get('/customerRep/logout', customerRepController.logout);
router.get('/customerRep/homepage', customerRepController.homepageView);

router.get('/customerRep/queries', customerRepController.queries);
router.post('/customerRep/queries/resolve', customerRepController.resolveQueries);
router.get('/customerRep/questions', customerRepController.fetchQuestions);
router.post('/customerRep/answerQuestion', customerRepController.answerQuestion);



/** 
 * 
 * User Login / Register / Logout API's
 * 
 * GET  /register -> Fetches Register page
 * GET  /login    -> Fetches Login page
 * GET  /logout   -> Clears session & Redirects to login page 
 * POST /register -> Creates a new user & redirects to login page 
 * POST /login    -> Fetches Homepage 
 * */ 
 

router.get('/register', loginController.registerView);
router.post('/register', loginController.registerUser);

router.get('/login', loginController.loginView);
router.post('/login', userPassport.authenticate('user'), loginController.login);
router.get('/logout', loginController.logoutUser);

router.get('/profile', loginController.getProfile);
router.get('/homepage', loginController.homepageView);


router.get('/alert', loginController.fetchAlert);
router.post('/alert', loginController.setAlert);

router.get('/notifications', loginController.fetchNotifications);

router.get('/auctionHistory', loginController.auctionHistory);
router.get('/bidHistory', loginController.bidHistory);


router.post('/raiseQuery', loginController.raiseQuery);
router.get('/userQuery', loginController.queryView);
router.post('/userQuery', loginController.postQuestion);
router.get('/fetchQA', loginController.fetchQuestionAnswer);

router.post('/fetchQA/filter', loginController.fetchQuestionAnswerFilter);


/**
 * Product Search API
 * 
 * GET /category -> Fetches All available categories
 * GET /category/:id/subcategory -> Fetches all subcategories | categoryId
 * GET /subcategory/:sc_id -> Fetches products in subcategory (Add pagination) | subcategoryId
 * GET /product -> Fetch products (Add pagination)
 * GET /product/:id -> Fetch product by ID | productId
 * POST /:scId/product/filter -> Filter products by scId & filters | subcategoryId
 */

router.get('/category', searchController.categories);
router.get('/category/:categoryId/subcategories', searchController.subCategories);

router.get('/subcategory/:categoryId/products', searchController.productsByCategoryId);
router.post('/subcategory/:categoryId/products/filter', searchController.productsByFilter);

router.get('/products', searchController.products);
router.get('/product/:productId', searchController.productById);
router.get('/product', searchController.productView);
router.get('/similarItems/:productId', searchController.similarItems);


/**
 * 
 * Auction / Bid API
 * 
 * GET - /bidHistory - get all past bids for userId 
 * GET - /auctionHistory - get all past auctions of userId
 * GET - /auctions - get active auctions             
 * POST - /createAuction - create auction |  {}     
 * POST - /placeBid/:productId - place Bid in an auctionId | productId
 * 
 */

router.get('/auctions', auctionController.auctions);
router.post('/createAuction', upload.single('image'), auctionController.createAuction);
router.get('/sell', auctionController.sell);

router.post('/placeBid', auctionController.placeBid);
router.post('/placeAutoBid', auctionController.placeAutoBid);
router.get('/product-image/:filename', searchController.fetchImage);


module.exports = router;


