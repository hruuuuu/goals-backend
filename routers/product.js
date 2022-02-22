const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

// 到資料庫product撈出所有商品資料 -> Products
router.get("/", productController.getProducts);

// 到資料庫product_category撈出所有商品類別 -> ProductsItem
router.get("/category", productController.getCategory);

// 到資料庫撈出 id = ? 的商品資料 -> ProductsDetail
router.get("/:productId", productController.getProductById);

module.exports = router;
