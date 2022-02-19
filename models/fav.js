//處理資料庫
const connection = require('../utils/database');

const handlePrepare = (string) => {
  let array = string.split(',');
  let prepareArray = [];
  for (let i = 1; i <= array.length; i++) {
    prepareArray.push('?');
  }
  const prepareFormat = prepareArray.join(',');
  return prepareFormat;
};

const getProductByFavItems = async (favItems) => {
  let [data, fields] = await connection.execute(
    `SELECT * FROM goals.product WHERE valid = 1 AND id IN (${favItems})`
  );
  console.log(data);
  return data;
};

module.exports = {
  getProductByFavItems,
};
