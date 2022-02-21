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
<<<<<<< HEAD
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1'
  );
  // console.log(data);
  return data;
=======
  const sql = `SELECT * FROM goals.product WHERE valid = 1`;
  const [response, fields] = await connection.execute(sql);
  return response;
>>>>>>> c42814875c6d241c1cac30c1e48fa58ca89c4bc4
};

const getProductsBySearch = async (search, category, activity) => {
  const searchFormat = `"%${search}%"`;
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (name LIKE ${searchFormat} AND (category_id IN (${category}) AND activity_id IN (${activity})))`;
  let [data, fields] = await connection.execute(sql);
  // console.log(data);
  return data;
};

const getProductsByFilter = async (minPrice, maxPrice, category, activity) => {
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (category_id IN (${category}) AND activity_id IN (${activity}))`;
  let [data, fields] = await connection.execute(sql);
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
<<<<<<< HEAD
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product_category'
  );
  // console.log(data);
  return data;
};

const getActivity = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.activity WHERE valid = 1'
  );
=======
  const sql = `SELECT * FROM goals.product_category`;
  const [data, fields] = await connection.execute(sql);
>>>>>>> c42814875c6d241c1cac30c1e48fa58ca89c4bc4
  // console.log(data);
  return data;
};

const getProductById = async (productId) => {
<<<<<<< HEAD
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1 AND id = ?',
    [productId]
  );
=======
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND id = ?`;
  const [data, fields] = await connection.execute(sql, [productId]);
>>>>>>> c42814875c6d241c1cac30c1e48fa58ca89c4bc4
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
