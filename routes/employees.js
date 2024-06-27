const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('./middleware/auth');
const Employee = require('../models/employee');

// Get all employees
router.get('/', authenticate, async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get an employee by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new employee
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { lastName, firstName, birthDate, photo, notes } = req.body;
        const newEmployee = await Employee.create({
            lastName,
            firstName,
            birthDate,
            photo,
            notes
        });
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an employee
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { lastName, firstName, birthDate, photo, notes } = req.body;
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        employee.lastName = lastName;
        employee.firstName = firstName;
        employee.birthDate = birthDate;
        employee.photo = photo;
        employee.notes = notes;
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an employee
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await employee.destroy();
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
