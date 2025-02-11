const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');

// Register routes
router.post('/register/:userType', register);

// Login route
router.post('/login', login);

module.exports = router; 