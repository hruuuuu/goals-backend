const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

const checkIsLoggedIn = (req, res) => {
    console.log(req.session);
    if(req.session.isLoggedIn === undefined){
      res.redirect(process.env.FRONTEND_URL);
    }
  }

router.post('/login', authController.userLogin);

router.post('/signup', authController.userSignUp);

router.post('/logout', authController.userLogout);

module.exports = router;
