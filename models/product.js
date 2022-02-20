//處理資料庫
const connection = require('../utils/database');
const { toNumber, handlePrepare } = require('../utils/sqlQuery');

const getProducts = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1'
  );
  // console.log(data);
  return data;
};

const getProductsBySearch = async (
  search,
  minPrice,
  maxPrice,
  category,
  activity
) => {
  const searchFormat = `"%${search}%"`;
  const categoryNum = toNumber(category);
  const activityNum = toNumber(activity);
  const categoryFormat = handlePrepare(category);
  const activityFormat = handlePrepare(activity);
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (name LIKE ${searchFormat} AND (category_id IN (${categoryFormat}) AND activity_id IN (${activityFormat})))`;
  let [data, fields] = await connection.execute(
    sql,
    categoryNum.concat(activityNum)
  );
  // console.log(data);
  return data;
};

const getProductsByFilter = async (minPrice, maxPrice, category, activity) => {
  const categoryNum = toNumber(category);
  const activityNum = toNumber(activity);
  const categoryFormat = handlePrepare(category);
  const activityFormat = handlePrepare(activity);
  const sql = `SELECT * FROM goals.product WHERE valid = 1 AND price BETWEEN ${minPrice} AND ${maxPrice} AND (category_id IN (${categoryFormat}) AND activity_id IN (${activityFormat}))`;
  let [data, fields] = await connection.execute(
    sql,
    categoryNum.concat(activityNum)
  );
  // console.log(data);
  return data;
};

const getCategory = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product_category'
  );
  // console.log(data);
  return data;
};

const getProductById = async (productId) => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1 AND id = ?',
    [productId]
  );
  // console.log(data);
  return data;
};

module.exports = {
  getProducts,
  getProductsBySearch,
  getProductsByFilter,
  getCategory,
  getProductById,
};
