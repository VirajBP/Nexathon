const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const {getAllProducts, createOrder, getMyOrders, cancelOrder} = require("../Controllers/consumerController")

router.get('/products', auth, getAllProducts);
router.post('/order', auth, createOrder);
router.get('/orders', auth, getMyOrders);
router.put('/order/:id/cancel', auth, cancelOrder);

module.exports = router; 