const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const Consumer = require('../Model/Consumer');
const Product = require('../Model/Product');

// Get consumer profile
router.get('/profile', auth, async (req, res) => {
    try {
        const consumer = await Consumer.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: consumer
        });
    } catch (error) {
        console.error('Error fetching consumer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
});

// Get all available products
router.get('/products', auth, async (req, res) => {
    try {
        const products = await Product.find()
            .populate('farmer', 'name location phoneNumber');
            
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
});

module.exports = router; 