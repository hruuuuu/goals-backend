// 處理資料庫
const connection = require('../utils/database');
const productController = require('../controllers/product');
const { toNumber, handlePrepare } = require('../utils/sqlQuery');

const getActivity = async () => {
  const sql = `SELECT * FROM goals.activity`;
  const [response, fields] = await connection.execute(sql);
  // console.log(data);
  return response;
};

const getProducts = async () => {
  const sql = `SELECT * FROM goals.product WHERE valid = 1`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

const getProductsBySearch = async (search, category, activity) => {
  const searchFormat = `"%${search}%"`;
  const categoryNum = toNumber(category);
  const activityNum = toNumber(activity);
  const categoryFormat = handlePrepare(category);
  const activityFormat = handlePrepare(activity);
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND (name LIKE ${searchFormat} AND (category_id IN (${categoryFormat}) AND activity_id IN (${activityFormat})))`;
  const [response, fields] = await connection.execute(
    sql,
    categoryNum.concat(activityNum)
  );
  return response;
};

const getProductsByFilter = async (category, activity) => {
  const categoryNum = toNumber(category);
  const activityNum = toNumber(activity);
  const categoryFormat = handlePrepare(category);
  const activityFormat = handlePrepare(activity);
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND (category_id IN (${categoryFormat}) AND activity_id IN (${activityFormat}))`;
  const [response, fields] = await connection.execute(
    sql,
    categoryNum.concat(activityNum)
  );
  return response;
};

const getProductsBySort = async (column, method) => {
  const sql = `SELECT * FROM goals.product WHERE valid = 1 ORDER BY ${column} ${method}`;
  const [data, fields] = await connection.execute(sql);
  // console.log(data);
  return data;
};

const getCategory = async () => {
  const sql = `SELECT * FROM goals.product_category`;
  const [data, fields] = await connection.execute(sql);
  // console.log(data);
  return data;
};

const getProductById = async (productId) => {
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND id = ?`;
  const [data, fields] = await connection.execute(sql, [productId]);
  // console.log(data);
  return data;
};

module.exports = {
  getActivity,
  getProducts,
  getProductsBySearch,
  getProductsByFilter,
  getProductsBySort,
  getCategory,
  getProductById,
};
