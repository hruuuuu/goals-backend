// 處理資料庫
const connection = require('../utils/database');

const getMembers = async () => {
  const sql = `SELECT * FROM goals.member`;
  const [data, fields] = await connection.execute(sql);
  // console.log(data);
  return data;
};

module.exports = {
  getMembers,
};
