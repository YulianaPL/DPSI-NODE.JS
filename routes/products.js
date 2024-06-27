// routes/products.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');

// Your product routes go here
// For example:
router.get('/', authenticate, (req, res) => {
    res.send('Product list');
});

router.post('/', authenticate, authorize(['admin']), (req, res) => {
    res.send('Create product');
});

module.exports = router;
