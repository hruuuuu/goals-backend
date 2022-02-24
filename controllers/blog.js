const blogModel = require('../models/blog');
const connection = require('../utils/database');

const getBlogs = async (req, res, next) => {
  const data = await blogModel.getBlogs();
  // req.params.blogId
  // req.query.page <- 第幾頁
  // /api/blog?page=

  // 取得目前在第幾頁
  // 如果沒有設定 req.quyer.page，那就設成 1
  let page = req.query.page || 1;
  // console.log("aaaaaaaaa", page);

  // 取得目前的總筆數
  let total = await blogModel.countByBlog();

  // 計算總共應該要有幾頁
  const perPage = 6;
  // lastPage: 總共有幾頁
  const lastPage = Math.ceil(total / perPage);
  // console.log(total);

  // 計算 SQL 要用的 offset
  let offset = (page - 1) * perPage;
  // 取得資料
  let dataCount = await blogModel.pageBlog(perPage, offset);
  // console.log(total, perPage, lastPage);
  // 準備要 response

  res.json({
    pagination: { total, perPage, page, lastPage },
    dataCount,
  });
};

const getBlogById = async (req, res, next) => {
  const blogId = req.params.blogId;
  const data = await blogModel.getBlogById(blogId);
  res.json(data);
};

module.exports = { getBlogs, getBlogById };
