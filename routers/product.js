const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

<<<<<<< HEAD
//到資料庫product撈出所有商品資料 -> Products
=======
// 到資料庫product撈出所有商品資料 -> Products
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480
router.get("/", productController.getProducts);

// 到資料庫product_category撈出所有商品類別 -> ProductsItem
router.get("/category", productController.getCategory);

<<<<<<< HEAD
//到資料庫acticity撈出所有活動 -> Filter, FilterCheckbox
// router.get("/activity", productController.getActivity);

//到資料庫撈出 id = ? 的商品資料 -> ProductsDetail
=======
// 到資料庫撈出 id = ? 的商品資料 -> ProductsDetail
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480
router.get("/:productId", productController.getProductById);

module.exports = router;
