// 處理商業行為
const dietlogModel = require('../models/dietlog');

const getDietlogs = async (req, res, next) => {
  const date = req.query.date;
  if (req.query.date) {
    const data = await dietlogModel.getDietlogsByDate(date);
    res.json(data);
  } else {
    const data = await dietlogModel.getDietlogs();
    res.json(data);
  }
};

const getDietlogsCategory = async (req, res, next) => {
  const data = await dietlogModel.getDietlogsCategory();
  res.json(data);
};

const updateDietlogValidById = async (req, res, next) => {
  const id = req.body.id;
  const data = await dietlogModel.updateDietlogValidById(id);
  if (data.changedRows !== 0) {
    res.status(202).json({ code: 20001, msg: '刪除成功' });
  } else {
    res.status(400).json({ code: 40001, msg: '資料不存在' });
  }
};

const updateDietlogDataById = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const time = req.body.time;
  console.log(id, title, description, category, time);
  const data = await dietlogModel.updateDietlogDataById(
    id,
    title,
    description,
    category,
    time
  );
  if (data.changedRows !== 0) {
    res.status(202).json({ code: 20001, msg: '編輯成功' });
  } else {
    res.status(400).json({ code: 40001, msg: '資料不存在' });
  }
};

module.exports = {
  getDietlogs,
  getDietlogsCategory,
  updateDietlogValidById,
  updateDietlogDataById,
};
