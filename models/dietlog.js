// 處理資料庫
const connection = require('../utils/database');

const getDietlogs = async () => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

const getDietlogsByDate = async (date) => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1 AND DATE(created_at) = ?`;
  const [response, fields] = await connection.execute(sql, [date]);
  return response;
};

const getDietlogsCategory = async () => {
  const sql = `SELECT * FROM goals.diet_category`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

const updateDietlogValidById = async (id) => {
  const sql = `UPDATE goals.diet SET valid = 0 WHERE id = ?`;
  const [response, fields] = await connection.execute(sql, [id]);
  return response;
};

const updateDietlogDataById = async (
  id,
  title,
  description,
  category,
  time
) => {
  const sql = `UPDATE goals.diet SET title = ?, description = ?,category_id = ?, edited_at = ? WHERE id = ?`;
  const [response, fields] = await connection.execute(sql, [
    title,
    description,
    category,
    time,
    id,
  ]);
  return response;
};

module.exports = {
  getDietlogs,
  getDietlogsByDate,
  getDietlogsCategory,
  updateDietlogValidById,
  updateDietlogDataById,
};
