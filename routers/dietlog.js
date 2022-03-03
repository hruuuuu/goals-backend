const express = require('express');
const router = express.Router();
const dietlogController = require('../controllers/dietlog');

router.get('/', dietlogController.getDietlogs);

router.get('/category', dietlogController.getDietlogsCategory);

router.patch('/update/valid', dietlogController.updateDietlogValidById);

// 因為要上傳圖片 不能使用patch
router.post(
  '/update/data',
  dietlogController.imgUploader.array('imgs', 6),
  dietlogController.updateDietlogImgById,
  dietlogController.updateDietlogDataById
);

router.post(
  '/insert/data',
  dietlogController.imgUploader.array('imgs', 6),
  dietlogController.insertDietlogData,
  dietlogController.insertDietlogImgById
);

router.post('/update/food', dietlogController.updateDietlogFoodById);

router.post('/insert/food', dietlogController.insertDietlogFoodById);

router.post('/image', dietlogController.getDietlogsImgById);

router.post('/food', dietlogController.getDietlogsFoodById);

module.exports = router;
