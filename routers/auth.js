const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.checkUser);

router.post('/login', authController.userLogin);

router.post('/signup', authController.userSignUp);

router.get('/logout', authController.userLogout);

module.exports = router;
