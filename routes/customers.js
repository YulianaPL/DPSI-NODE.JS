const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');
const Customer = require('../models/customer');

// Get all customers
router.get('/', authenticate, async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a customer by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new customer
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const newCustomer = await Customer.create({
            customerName,
            contactName,
            address,
            city,
            postalCode,
            country
        });
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a customer
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        customer.customerName = customerName;
        customer.contactName = contactName;
        customer.address = address;
        customer.city = city;
        customer.postalCode = postalCode;
        customer.country = country;
        await customer.save();
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a customer
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customer.destroy();
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
