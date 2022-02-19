//處理資料庫
const connection = require('../utils/database');

const getProducts = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1'
  );
  //console.log(data);
  return data;
};

// ** 暫時先用字串串(prepared statement有點問題)
const getProductsBySearch = async (
  search,
  minPrice,
  maxPrice,
  category,
  activity
) => {
  const searchFormat = `"%${search}%"`;
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (name LIKE ${searchFormat} AND (category_id IN (${category}) AND activity_id IN (${activity})))`;
  let [data, fields] = await connection.execute(sql);
  //console.log(data);
  return data;
};

const getProductsByFilter = async (minPrice, maxPrice, category, activity) => {
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (category_id IN (${category}) AND activity_id IN (${activity}))`;
  let [data, fields] = await connection.execute(sql);
  //console.log(data);
  return data;
};

const getCategory = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product_category'
  );
  //console.log(data);
  return data;
};

const getActivity = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.activity WHERE valid = 1'
  );
  //console.log(data);
  return data;
};

const getProductById = async (productId) => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1 AND id = ?',
    [productId]
  );
  //console.log(data);
  return data;
};

module.exports = {
  getProducts,
  getProductsBySearch,
  getProductsByFilter,
  getCategory,
  getActivity,
  getProductById,
};
