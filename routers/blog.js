const express = require("express");
const router = express.Router();
const blogModels = require("../models/blog.js");

//到資料庫blog撈出所有商品資料 -> Blogs
router.get('/', blogModels.getBlogs);

module.exports = router;
