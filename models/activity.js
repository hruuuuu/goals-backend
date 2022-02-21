// 處理資料庫
const connection = require('../utils/database');

const getActivity = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.activity WHERE valid = 1'
  );
  // console.log(data);
  return data;
};

module.exports = {
  getActivity,
};
