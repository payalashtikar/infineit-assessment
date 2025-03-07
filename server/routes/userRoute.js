const express = require('express');
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, logout, addToCart, getCartProducts, removeFromItem, updateProductQuantity, confirmOrder, getMyOrders } = require('../controller/userController');
const { addProduct } = require('../controller/productController');

router
    .post('/user/register', register)
    .post('/user/login', login)
    .post('/admin/login', login)
    .put('/user/logout', authMiddleware, logout)
    .post('/cart/add', authMiddleware, addToCart)
    .get("/cart", authMiddleware, getCartProducts)
    .delete('/cart/:cartId/product/:productId', authMiddleware, removeFromItem)
    .patch('/cart/update-product-quantity/:productId', authMiddleware, updateProductQuantity)

    .post('/order/confirm', authMiddleware, confirmOrder).get('/orders/my-orders', authMiddleware, getMyOrders);

module.exports = router;