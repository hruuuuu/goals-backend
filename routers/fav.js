const express = require('express');
const router = express.Router();
const favController = require('../controllers/fav');

//TODO:到資料庫撈出 id IN (?) 的商品資料 -> FavList
router.get('/', favController.getProductByFavItems);

module.exports = router;
