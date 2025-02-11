const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const Farmer = require('../Model/Farmer');
const Product = require('../Model/Product');

// Get farmer profile
router.get('/profile', auth, async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: farmer
        });
    } catch (error) {
        console.error('Error fetching farmer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
});

// Add a new product
router.post('/products', auth, async (req, res) => {
    try {
        const { productName, productVariety, quantity, price, estimatedDate } = req.body;
        
        const product = new Product({
            farmer: req.user.id,
            productName,
            productVariety,
            quantity,
            price,
            estimatedDate: new Date(estimatedDate)
        });

        await product.save();

        // Add product to farmer's products array
        await Farmer.findByIdAndUpdate(
            req.user.id,
            { $push: { products: product._id } }
        );

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding product'
        });
    }
});

// Get all products of a farmer
router.get('/products', auth, async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user.id });
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