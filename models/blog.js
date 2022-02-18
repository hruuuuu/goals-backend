//處理資料庫
const connection = require("../utils/database");

const getBlogs = async () => {
  let [data, fields] = await connection.execute("SELECT * FROM goals.blog");
  console.log(data);
  return data;
};

module.exports = { getBlogs };
