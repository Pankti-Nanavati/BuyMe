const {loginView, registerView, homepageView, registerUser } = require('../../controllers/loginController');
const search = require('../../controllers/searchController');
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const email_id = req.body.email_id;
    const name = req.body.name;
    const address = req.body.address;
    const phone_number = req.body.phone_number;
    const user_name = req.body.user_name;
    const values = [email_id, hashedPassword, name, user_name, phone_number, address];

    try {
        const result = registerUser(values);
        console.log('Inside register', result);
        return res.redirect('login');
    } catch (err) {
        if (err == "User Already Exists") {
            return res.redirect('register');
        }
    }  
});


/**
 * Product Search API
 * 
 * GET /category -> Fetches All available categories
 * GET /category/:id/subcategory -> Fetches all subcategories
 * GET /subcategory/:sc_id -> Fetches products in subcategory (Add pagination)
 * GET /product -> Fetch products (Add pagination)
 * GET /product/:id -> Fetch product by ID
 *  POST /:scId/product/filter -> Filter products by scId & filters
 */

router.get('/category', passport.authenticate('local', (req, res) => {
        try{
            const categories = search.categories();
            res.send(JSON.stringify(categories));
        } catch (error) {
            console.log(error);
        }
}));

router.get('/category/:id/subcategory', passport.authenticate('local', (req, res) => {
    try{
        const id = req.params.id;
        const subCategories = search.subCategories(id);
        res.send(JSON.stringify(subCategories));
    } catch (error) {
        console.log(error);
    }
}));


router.get('/subcategory/:scId', passport.authenticate('local', (req, res) => {
    try{
        const scId = req.params.scId;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const subCategories = search.productsByCategoryId(scId, offset, limit);
        res.send(JSON.stringify(subCategories));
    } catch (error) {
        console.log(error);
    }
}));

router.post('/:scId/product/filter', passport.authenticate('local', (req, res) => {
    try{
        const scId = req.params.scId;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const filter = req.body.filter;
        const products = search.productsByFilter(scId, filter, offset, limit);
        res.send(JSON.stringify(products));
    } catch (error) {
        console.log(error);
    }
}));

router.get('/product', passport.authenticate('local', (req, res) => {
    try{
        const offset = req.query.offset;
        const limit = req.query.limit;
        const products = search.products(offset, limit);
        res.send(JSON.stringify(products));
    } catch (error) {
        console.log(error);
    }
}));

router.get('/product/:id', passport.authenticate('local', (req, res) => {
    try{
        const id = req.params.id;
        const products = search.productById(id);
        res.send(JSON.stringify(products));
    } catch (error) {
        console.log(error);
    }
}));



module.exports = router;


