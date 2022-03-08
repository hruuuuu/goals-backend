// 處理資料庫
const connection = require('../utils/database');

const getFood = async () => {
  const sql = `SELECT * FROM goals.food`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

module.exports = { getFood };
