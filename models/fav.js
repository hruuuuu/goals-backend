// 處理資料庫
const connection = require('../utils/database');
const { toNumber, handlePrepare } = require('../utils/sqlQuery');

const getProductByFavItems = async (favItems) => {
  const favItemsNum = toNumber(favItems);
  const favItemsFormat = handlePrepare(favItems);

  let [data, fields] = await connection.execute(
    `SELECT * FROM goals.product WHERE valid = 1 AND id IN (${favItemsFormat})`,
    favItemsNum
  );
  // console.log(data);
  return data;
};

module.exports = {
  getProductByFavItems,
};
