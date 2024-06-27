const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const OrderDetail = require('../models/orderDetail');

// Get all order details
router.get('/', authenticate, async (req, res) => {
    try {
        const orderDetails = await OrderDetail.findAll();
        res.json(orderDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get order detail by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findByPk(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }
        res.json(orderDetail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new order detail
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { orderID, productID, quantity } = req.body;
        const newOrderDetail = await OrderDetail.create({ orderID, productID, quantity });
        res.status(201).json(newOrderDetail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an order detail
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { orderID, productID, quantity } = req.body;
        const orderDetail = await OrderDetail.findByPk(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }
        orderDetail.orderID = orderID;
        orderDetail.productID = productID;
        orderDetail.quantity = quantity;
        await orderDetail.save();
        res.json(orderDetail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an order detail
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findByPk(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }
        await orderDetail.destroy();
        res.json({ message: 'Order detail deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
