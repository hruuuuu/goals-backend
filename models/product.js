//處理資料庫
const connection = require('../utils/database');

const getProducts = async () => {
  let [data, fields] = await connection.execute('SELECT * FROM product');
  console.log(data);
  return data;
};

const getCategory = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM product_category'
  );
  console.log(data);
  return data;
};

const getProductById = async (productId) => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM product WHERE id = ?',
    [productId]
  );
  console.log(data);
  return data;
};

module.exports = { getProducts, getCategory, getProductById };
