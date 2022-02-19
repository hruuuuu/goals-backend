const express = require("express");
const router = express.Router();
const blogModels = require("../controllers/blog.js");

//到資料庫blog撈出所有資料 -> Blogs
router.get("/", blogModels.getBlogs);

//到資料庫撈出 id = ? 的blog資料 -> BlogArticle
router.get("/:blogId", blogModels.getBlogById);


module.exports = router;
