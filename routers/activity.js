const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity');

//到資料庫activity撈出所有活動資料 -> ProductItem, FavItem
router.get('/', activityController.getActivity);

module.exports = router;
