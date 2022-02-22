const express = require('express');
const router = express.Router();
const connection = require('../utils/database');
const alert = require('alert');
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

/* google token 的中間件 */
passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));


router.post('/google', passport.authenticate('google-token', {session: false}), async(req, res, next) => {
    const {provider} = req.user;
    const {email, name, verified_email} = req.user._json;

    // 檢查用戶是否已存在
    const [userCheck] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
    if(userCheck.length > 0){
        alert("此用戶已存在")
        return res.json({
            msg: "此用戶已存在"
        })
    }

    // 加入新用戶資料到資料庫中
    const newAccount = await connection.execute('INSERT INTO goals.member (email, username, password, valid, verifyString) VALUE (?, ?, ?, ?, ?)', [email, name, "socialMedia", verified_email, provider]); 
    
    // const googleMember = {
    //     id: newAccount.id,
    //     email: newAccount.email
    // }

    // req.session.member = googleMember;

    alert("第三方登入成功");

    res.status(201).json({
        msg: "第三方登入成功",
        data: newAccount
    })
});


// 如果用戶登出但瀏覽器google帳號未登出，下次再登入會變成不會跳到填寫google帳號密碼畫面
router.post('/logout', async(req, res, next) => {
    req.logout();
    // res.redirect('/')
    return res.json({
        msg: "會員登出成功"
    })
})

module.exports = router;