const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');

router.post('/', commentController.findComments);

router.post('/check', commentController.checkEligible);

router.post('/new', commentController.addNewComment);

module.exports = router;