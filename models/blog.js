//處理資料庫
const connection = require("../utils/database");

// 取得blog所有資料
const getBlogs = async () => {
  let [data, fields] = await connection.execute(
    "SELECT * FROM goals.blog WHERE valid = 1"
  );
  // console.log(data);
  return data;
};

// 取得指定id blog資料
const getBlogById = async (blogId) => {
  let [data, fields] = await connection.execute(
    "SELECT * FROM goals.blog WHERE valid = 1 AND id = ?",
    [blogId]
  );
  // console.log(data);
  return data;
};

// 取得 blog 總筆數
async function countByBlog() {
  let [total] = await connection.execute(
    "SELECT COUNT(*) AS total FROM goals.blog"
  );
  return total[0].total;
}


async function pageBlog(perPage, offset) {
  let [data] = await connection.execute(
    "SELECT * FROM goals.blog WHERE valid = 1 LIMIT ? OFFSET ?",
    [perPage, offset]
  );
  // console.log(data);
  return data;
}

module.exports = { getBlogs, getBlogById, countByBlog, pageBlog };
