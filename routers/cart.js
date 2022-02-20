const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

//到資料庫product撈出所有商品資料 -> Products
router.get('/', cartController.getProducts);

module.exports = router;