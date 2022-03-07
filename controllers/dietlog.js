// 處理商業行為
const dietlogModel = require('../models/dietlog');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

// 設定圖片要存的位置 & 檔名
const storage = multer.diskStorage({
  // 設定儲存目的地
  destination: (req, file, cb) => {
    // 先建立好資料夾/public/uploads
    // multer的cb第一個參數是錯誤 一般都設定null即可
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    // 原始的檔名會存在file這個變數
    // console.log('原始的filename', file);
    // 拿到副檔名
    const ext = file.originalname.split('.').pop();
    // 生成一個新的檔名(如: 加上uuid或時間戳記)
    cb(null, `dietlog-${uuidv4().slice(0, 10)}.${ext}`);
  },
});

const imgUploader = multer({
  storage,
  // fileFilter用來過濾圖片 加上mimetype可以過濾檔案格式
  fileFilter: (req, file, cb) => {
    // console.log('file.mimetype', file.mimetype);
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpg' &&
      file.mimetype !== 'image/png'
    ) {
      cb(new Error('不接受的檔案型態', false));
    } else {
      cb(null, true);
    }
  },
  // limits用來限制檔案尺寸
  limits: {
    fileSize: 2048 * 2048,
  },
});

const getDietlogs = async (req, res, next) => {
  const memberId = req.session.member.id;
  const date = req.body.date;
  if (req.body.date) {
    const data = await dietlogModel.getDietlogsByDate(memberId, date);
    res.json(data);
  } else {
    const data = await dietlogModel.getDietlogs(memberId);
    res.json(data);
  }
};

const getDietlogsCategory = async (req, res, next) => {
  const data = await dietlogModel.getDietlogsCategory();
  res.json(data);
};

const updateDietlogValidById = async (req, res, next) => {
  const id = req.body.id;
  const memberId = req.session.member.id;
  try {
    const data = await dietlogModel.updateDietlogValidById(id, memberId);
    res.status(202).json({ code: 20001, msg: '刪除成功' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 40001, msg: '資料不存在' });
  }
};

const updateDietlogImgById = async (req, res, next) => {
  if (req.files) {
    const id = req.body.id;
    let fileNames = [];
    req.files.forEach((file) => {
      fileNames.push(file.filename);
    });
    try {
      const updateValidResponse = await dietlogModel.updateDietlogImgValidById(
        id
      );
      const addImgResponse = await dietlogModel.updateDietlogImgById(
        fileNames,
        id
      );
      next();
    } catch (error) {
      res.status(400).json({ code: 40001, msg: '儲存圖片發生錯誤' });
    }
  } else {
    next();
  }
};

const updateDietlogDataById = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const memberId = req.session.member.id;
  const description =
    req.body.description === undefined ||
    req.body.description === null ||
    req.body.description === 'null'
      ? ''
      : req.body.description;
  const category = req.body.category;
  const datetime = req.body.datetime;
  try {
    const data = await dietlogModel.updateDietlogDataById(
      id,
      title,
      description,
      category,
      datetime,
      memberId
    );
    res.status(202).json({ code: 20001, msg: '編輯成功' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 40001, msg: '編輯資料發生錯誤' });
  }
};

const insertDietlogData = async (req, res, next) => {
  const title =
    req.body.title === undefined ||
    req.body.title === null ||
    req.body.title === 'null'
      ? ''
      : req.body.title;
  const description =
    req.body.description === undefined ||
    req.body.description === null ||
    req.body.description === 'null'
      ? ''
      : req.body.description;
  const category = req.body.category;
  const datetime = req.body.datetime;
  const memberId = req.session.member.id;
  try {
    const data = await dietlogModel.insertDietlogData(
      title,
      description,
      category,
      datetime,
      memberId
    );
    req.id = data[0]['id'];
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 40001, msg: '新增資料發生錯誤' });
  }
};

const insertDietlogImgById = async (req, res, next) => {
  const id = req.id;
  if (req.files) {
    let fileNames = [];
    req.files.forEach((file) => {
      fileNames.push(file.filename);
    });
    try {
      const addImgResponse = await dietlogModel.updateDietlogImgById(
        fileNames,
        id
      );
      res.status(202).json({ code: 20001, msg: '新增成功' });
    } catch (error) {
      res.status(400).json({ code: 40001, msg: '儲存圖片發生錯誤' });
    }
  } else {
    res.status(202).json({ code: 20001, msg: '新增成功' });
  }
};

const updateDietlogFoodById = async (req, res, next) => {
  const id = req.body.id;
  const foods = req.body.foods;
  try {
    const response = await dietlogModel.updateDietlogFoodById(id, foods);
    res.status(202).json({ code: 20001, msg: '新增成功' });
  } catch (error) {
    res.status(400).json({ code: 40001, msg: '新增食物發生錯誤' });
  }
};

const insertDietlogFoodById = async (req, res, next) => {
  const memberId = req.session.member.id;
  const foods = req.body;
  try {
    const response = await dietlogModel.insertDietlogFoodById(memberId, foods);
    res.status(202).json({ code: 20001, msg: '新增成功' });
  } catch (error) {
    res.status(400).json({ code: 40001, msg: '新增食物發生錯誤' });
  }
};

const getDietlogsImgById = async (req, res, next) => {
  const id = req.body.id;
  try {
    const data = await dietlogModel.getDietlogsImgById(id);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const getDietlogsFoodById = async (req, res, next) => {
  if (req.body.id) {
    const id = req.body.id;
    try {
      const data = await dietlogModel.getDietlogsFoodById(id);
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  } else if (req.body.ids) {
    const ids = req.body.ids;
    try {
      const response = await dietlogModel.getDietlogsFoodByIds(ids);
      const data = {
        calories: response[0]['SUM(calories)'],
        protein: response[0]['SUM(protein)'],
        fat: response[0]['SUM(fat)'],
        carb: response[0]['SUM(carb)'],
      };
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ code: 40002, msg: '缺少參數' });
  }
};

module.exports = {
  imgUploader,
  getDietlogs,
  getDietlogsCategory,
  updateDietlogValidById,
  updateDietlogDataById,
  updateDietlogImgById,
  getDietlogsImgById,
  insertDietlogData,
  insertDietlogImgById,
  updateDietlogFoodById,
  getDietlogsFoodById,
  insertDietlogFoodById,
};
