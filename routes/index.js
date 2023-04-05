const express = require('express');
const router = express.Router();
const apiRoutes = require('./api/index');

// Default Route
router.get('/', (req, res) => {
    return res.redirect('/api/login');
});

router.use('/api', apiRoutes);

module.exports = router;
