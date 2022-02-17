//處理資料庫
const connection = require('../utils/database');

const getProducts = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1'
  );
  console.log(data);
  return data;
};

const getProductsBySearch = async (search) => {
  search = `%${search}%`;
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1 AND name LIKE ?',
    [search]
  );
  console.log(search);
  console.log(data);
  return data;
};

const getCategory = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product_category'
  );
  console.log(data);
  return data;
};

const getActivity = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.activity WHERE valid = 1'
  );
  console.log(data);
  return data;
};

const getProductById = async (productId) => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1 AND id = ?',
    [productId]
  );
  console.log(data);
  return data;
};

module.exports = {
  getProducts,
  getProductsBySearch,
  getCategory,
  getActivity,
  getProductById,
};
