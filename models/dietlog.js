// 處理資料庫
const connection = require('../utils/database');
const { handlePrepare } = require('../utils/sqlQuery');

const getDietlogs = async () => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

const getDietlogsByDate = async (date) => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1 AND DATE(datetime) = ?`;
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

const updateDietlogImgById = (fileNames, id) => {
  fileNames.forEach(async (fileName) => {
    const sql = `INSERT INTO goals.diet_image (diet_id, name, valid) VALUES (?, ?, 1)`;
    const [response, fields] = await connection.execute(sql, [id, fileName]);
    return response;
  });
};

const updateDietlogImgValidById = async (id) => {
  const sql = `UPDATE goals.diet_image SET valid = 0 WHERE diet_id = ?`;
  const [response, fields] = await connection.execute(sql, [id]);
  return response;
};

const updateDietlogDataById = async (
  id,
  title,
  description,
  category,
  datetime
) => {
  const sql = `UPDATE goals.diet SET title = ?, description = ?, category_id = ?, edited_at = ? WHERE id = ?`;
  const [response, fields] = await connection.execute(sql, [
    title,
    description,
    category,
    datetime,
    id,
  ]);
  return response;
};

const insertDietlogData = async (title, description, category, datetime) => {
  const insert = `INSERT INTO goals.diet (title, description, category_id, datetime, valid) VALUES (?, ?, ?, ?, 1)`;
  const [insertResult] = await connection.execute(insert, [
    title,
    description,
    category,
    datetime,
  ]);
  const getId = `SELECT id FROM goals.diet ORDER BY id DESC LIMIT 1`;
  const [response, fields] = await connection.execute(getId);
  console.log(response);
  return response;
};

const getDietlogsImgById = async (id) => {
  const sql = `SELECT * FROM goals.diet_image WHERE valid = 1 AND diet_id = ?`;
  const [response, fields] = await connection.execute(sql, [id]);
  return response;
};

module.exports = {
  getDietlogs,
  getDietlogsByDate,
  getDietlogsCategory,
  updateDietlogValidById,
  updateDietlogDataById,
  updateDietlogImgById,
  getDietlogsImgById,
  updateDietlogImgValidById,
  insertDietlogData,
  // insertDietlogImgById,
};
