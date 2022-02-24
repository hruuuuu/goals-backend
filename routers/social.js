const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
// const FacebookStrategy = require('passport-facebook')
const socialController = require('../controllers/social');

/* google token 的中間件 */
passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

router.post('/google', passport.authenticate('google-token', {session: false}, socialController.googleUser));

/* Facebook token 的中間件 */
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     // callbackURL: "http://localhost:3000/"
// },
//     function(accessToken, refreshToken, profile, done) {
//         console.log(profile)
//         return done(null, profile);
//     }
// ));

// router.post('/facebook', passport.authenticate('facebook') ,async(req, res, next) => {
//     console.log(req)
// })

// 如果用戶登出但瀏覽器google帳號未登出，下次再登入會變成不會跳到填寫google帳號密碼畫面
router.post('/logout', socialController.socialLogout);

module.exports = router;