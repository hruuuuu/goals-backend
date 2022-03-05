// 處理資料庫
const connection = require('../utils/database');
const { handlePrepare, toNumber } = require('../utils/sqlQuery');

const getDietlogs = async () => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1`;
  const [response, fields] = await connection.execute(sql);
  return response;
};

const getDietlogsByDate = async (date) => {
  const sql = `SELECT * FROM goals.diet WHERE valid = 1 AND DATE(datetime) = ? ORDER BY category_id ASC`;
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
  // console.log(response);
  return response;
};

const updateDietlogFoodById = async (id, foods) => {
  const deletePrev = `UPDATE goals.diet_food SET valid = 0 WHERE diet_id = ?`;
  const [responseDelete] = await connection.execute(deletePrev, [id]);

  foods.forEach(async (food) => {
    const {
      name,
      calories,
      protein,
      fat,
      saturated_fat,
      trans_fat,
      carb,
      sugar,
      sodium,
    } = food;
    const sql = `INSERT INTO goals.diet_food (diet_id, name, calories, protein, fat, saturated_fat, trans_fat, carb, sugar, sodium, valid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    const [response, fields] = await connection.execute(sql, [
      id,
      name,
      calories,
      protein,
      fat,
      saturated_fat,
      trans_fat,
      carb,
      sugar,
      sodium,
    ]);
    return response;
  });
};

const insertDietlogFoodById = async (foods) => {
  const getId = `SELECT id FROM goals.diet ORDER BY id DESC LIMIT 1`;
  const [responseId] = await connection.execute(getId);
  const id = responseId[0]['id'];

  foods.forEach(async (food) => {
    const {
      name,
      calories,
      protein,
      fat,
      saturated_fat,
      trans_fat,
      carb,
      sugar,
      sodium,
    } = food;
    const sql = `INSERT INTO goals.diet_food (diet_id, name, calories, protein, fat, saturated_fat, trans_fat, carb, sugar, sodium, valid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    const [response, fields] = await connection.execute(sql, [
      id,
      name,
      calories,
      protein,
      fat,
      saturated_fat,
      trans_fat,
      carb,
      sugar,
      sodium,
    ]);
    return response;
  });
};

const getDietlogsImgById = async (id) => {
  const sql = `SELECT * FROM goals.diet_image WHERE valid = 1 AND diet_id = ?`;
  const [response, fields] = await connection.execute(sql, [id]);
  return response;
};

const getDietlogsFoodById = async (id) => {
  const sql = `SELECT * FROM goals.diet_food WHERE valid = 1 AND diet_id = ?`;
  const [response, fields] = await connection.execute(sql, [id]);
  return response;
};

const sumSql = `SUM(calories), SUM(protein), SUM(fat), SUM(saturated_fat), SUM(trans_fat), SUM(carb), SUM(sugar), SUM(sodium)`;

const getDietlogsFoodByIds = async (ids) => {
  const idsStr = ids.join(',');
  const idsFormat = handlePrepare(idsStr);
  const sumCal = `SELECT ${sumSql} FROM goals.diet_food WHERE valid = 1 AND diet_id IN (${idsFormat})`;
  const [response, fields] = await connection.execute(sumCal, ids);
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
  updateDietlogFoodById,
  getDietlogsFoodById,
  insertDietlogFoodById,
  getDietlogsFoodByIds,
};
