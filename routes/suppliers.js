const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');
const Supplier = require('../models/supplier');

// Get all suppliers
router.get('/', authenticate, async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a supplier by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new supplier
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const newSupplier = await Supplier.create({ supplierName, contactName, address, city, postalCode, country, phone });
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a supplier
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        supplier.supplierName = supplierName;
        supplier.contactName = contactName;
        supplier.address = address;
        supplier.city = city;
        supplier.postalCode = postalCode;
        supplier.country = country;
        supplier.phone = phone;
        await supplier.save();
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a supplier
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        await supplier.destroy();
        res.json({ message: 'Supplier deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
