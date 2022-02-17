//處理商業行為
const productModel = require('../models/product');

const getProducts = async (req, res, next) => {
  if (req.query.search) {
    //關鍵字搜尋
    const search = req.query.search;
    const searchData = await productModel.getProductsBySearch(search);
    res.json(searchData);
  } else {
    const data = await productModel.getProducts();
    res.json(data);
  }
  /*
  //價錢範圍
  const topPrice = req.query.topPrice;
  const lowPrice = req.query.lowPrice;

  //類別
  const category = req.query.category;

  //活動
  const activity = req.query.activity;
  */
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
