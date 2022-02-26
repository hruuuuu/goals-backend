const express = require('express');
const router = express.Router();
const dietlogController = require('../controllers/dietlog');

router.get('/', dietlogController.getDietlogs);

router.get('/category', dietlogController.getDietlogsCategory);

router.patch('/update/valid', dietlogController.updateDietlogValidById);

// 因為要上傳圖片 不能使用patch
router.post(
  '/update/data',
  dietlogController.imgUploader.array('imgs', 5),
  dietlogController.updateDietlogImgById,
  dietlogController.updateDietlogDataById
);

router.post('/image', dietlogController.getDietlogsImgById);

module.exports = router;
