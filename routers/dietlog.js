const express = require('express');
const router = express.Router();
const dietlogController = require('../controllers/dietlog');
const checkContoller = require('../utils/checkLogin');

router.post('/', checkContoller.checkLogin, dietlogController.getDietlogs);

router.get('/category', dietlogController.getDietlogsCategory);

router.patch(
  '/update/valid',
  checkContoller.checkLogin,
  dietlogController.updateDietlogValidById
);

// 因為要上傳圖片 不能使用patch
router.post(
  '/update/data',
  checkContoller.checkLogin,
  dietlogController.imgUploader.array('imgs', 6),
  dietlogController.updateDietlogImgById,
  dietlogController.updateDietlogDataById
);

router.post(
  '/insert/data',
  checkContoller.checkLogin,
  dietlogController.imgUploader.array('imgs', 6),
  dietlogController.insertDietlogData,
  dietlogController.insertDietlogImgById
);

router.post(
  '/update/food',
  checkContoller.checkLogin,
  dietlogController.updateDietlogFoodById
);

router.post(
  '/insert/food',
  checkContoller.checkLogin,
  dietlogController.insertDietlogFoodById
);

router.post('/image', dietlogController.getDietlogsImgById);

router.post('/food', dietlogController.getDietlogsFoodById);

module.exports = router;
