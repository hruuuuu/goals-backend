// 處理商業行為
const foodModel = require('../models/food');

const getFood = async (req, res, next) => {
  try {
    const data = await foodModel.getFood();
    res.status(202).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 40001, msg: '查詢發生錯誤' });
  }
};

module.exports = { getFood };
