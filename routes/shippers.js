const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');
const Shipper = require('../models/shipper');

// Get all shippers
router.get('/', authenticate, async (req, res) => {
    try {
        const shippers = await Shipper.findAll();
        res.json(shippers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a shipper by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const shipper = await Shipper.findByPk(req.params.id);
        if (!shipper) {
            return res.status(404).json({ message: 'Shipper not found' });
        }
        res.json(shipper);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new shipper
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { shipperName, phone } = req.body;
        const newShipper = await Shipper.create({ shipperName, phone });
        res.status(201).json(newShipper);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a shipper
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { shipperName, phone } = req.body;
        const shipper = await Shipper.findByPk(req.params.id);
        if (!shipper) {
            return res.status(404).json({ message: 'Shipper not found' });
        }
        shipper.shipperName = shipperName;
        shipper.phone = phone;
        await shipper.save();
        res.json(shipper);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a shipper
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const shipper = await Shipper.findByPk(req.params.id);
        if (!shipper) {
            return res.status(404).json({ message: 'Shipper not found' });
        }
        await shipper.destroy();
        res.json({ message: 'Shipper deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
