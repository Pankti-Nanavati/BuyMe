const express = require('express');
const path = require('path');

const router = express.Router();

const apiRoutes = require('./api/index');

// Default
router.get('/', (req, res) => {
    return res.redirect('/api/login');
});

router.use('/api', apiRoutes);

module.exports = router;
