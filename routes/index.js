const express = require('express');
const router = express.Router();
const apiRoutes = require('./api/index');

// Default Route
router.get('/', (req, res) => {
    return res.redirect('/api/login');
});

// Default Route
router.get('/admin', (req, res) => {
    return res.redirect('/api/admin/login');
});

// Default Route
router.get('/customerRep', (req, res) => {
    return res.redirect('/api/customerRep/login');
});


router.use('/api', apiRoutes);

module.exports = router;
