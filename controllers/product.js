//處理商業行為
const productModel = require('../models/product');
const connection = require('../utils/database');

// const handlePrepare = (string) => {
//   let array = string.split(',');
//   let prepareArray = [];
//   for (let i = 1; i <= array.length; i++) {
//     prepareArray.push('?');
//   }
//   return prepareArray.join(',');
// };

const getProducts = async (req, res, next) => {
  //關鍵字搜尋
  const search = req.query.search;
  //價錢範圍
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  //類別
  const category = req.query.category;

  //活動
  const activity = req.query.activity;
  if (req.query.search) {
    const data = await productModel.getProductsBySearch(
      search,
      minPrice,
      maxPrice,
      category,
      activity
    );
    res.json(data);
  } else if (req.query.category) {
    const data = await productModel.getProductsByFilter(
      minPrice,
      maxPrice,
      category,
      activity
    );
    res.json(data);
  } else {
    const data = await productModel.getProducts();
    res.json(data);
  }
  // const searchFormat = `%${search}%`;
  // const categoryArr = handlePrepare(category);
  // const activityArr = handlePrepare(activity);
  // let [filterData, fields] = await connection.execute(
  //   `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ? AND ? OR (name LIKE ? AND (category_id IN (${categoryArr}) AND activity_id IN (${activityArr})))`,
  //   [minPrice, maxPrice, searchFormat, categoryFormat, activityFormat]
  // );
  //console.log(filterData);
  //res.json(filterData);
};

const getCategory = async (req, res, next) => {
  const data = await productModel.getCategory();
  res.json(data);
};

const getActivity = async (req, res, next) => {
  const data = await productModel.getActivity();
  res.json(data);
};

const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  const data = await productModel.getProductById(productId);
  res.json(data);
};

module.exports = { getProducts, getCategory, getActivity, getProductById };
