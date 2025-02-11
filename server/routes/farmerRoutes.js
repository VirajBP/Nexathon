const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const {
    createProduct,
    updateProduct,
    getMyProducts,
    getMyOrders,
    updateOrderStatus,
    markHarvestComplete
} = require('../Controllers/farmerController');

router.post('/product', auth, createProduct);
router.put('/product/:id', auth, updateProduct);
router.get('/products', auth, getMyProducts);
router.get('/orders', auth, getMyOrders);
router.put('/order/:id', auth, updateOrderStatus);
router.put('/product/:id/complete', auth, markHarvestComplete);

module.exports = router; 