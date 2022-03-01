const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verify');

router.post('/resend', verifyController.resendEmail);

router.post('/forget', verifyController.forgetEmail);

router.post('/reset', verifyController.resetEmail);

router.get('/:verifyString', verifyController.getVerifyString);

module.exports = router;
