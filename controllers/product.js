//處理商業行為
const productModel = require('../models/product');

const getProducts = async (req, res, next) => {
  const data = await productModel.getProducts();
  res.json(data);

  //關鍵字搜尋
  const query = req.query.query;

  //價錢範圍
  const topPrice = req.query.topPrice;
  const lowPrice = req.query.lowPrice;

  //類別
  const category = req.query.category;
};

const getCategory = async (req, res, next) => {
  const data = await productModel.getCategory();
  res.json(data);
};

const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  const data = await productModel.getProductById(productId);
  res.json(data);
};

module.exports = { getProducts, getCategory, getProductById };
