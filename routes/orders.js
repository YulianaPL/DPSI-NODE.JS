const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');

// Define your order routes here
router.get('/', authenticate, (req, res) => {
    res.send('List of orders');
});

router.post('/', authenticate, authorize(['admin', 'user']), (req, res) => {
    res.send('Create order');
});

module.exports = router;
