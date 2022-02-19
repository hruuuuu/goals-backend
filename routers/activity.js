const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity');

//TODO:
router.get('/', activityController.getActivity);

module.exports = router;
