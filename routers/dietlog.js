const express = require('express');
const router = express.Router();
const dietlogController = require('../controllers/dietlog');

router.get('/', dietlogController.getDietlogs);

router.get('/category', dietlogController.getDietlogsCategory);

router.patch('/update/valid', dietlogController.updateDietlogValidById);

router.patch('/update/data', dietlogController.updateDietlogDataById);

module.exports = router;
