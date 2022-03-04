const connection = require("../utils/database");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

/* google token 的中間件 */
passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  async (req, res, next) => {
    try {
      const { provider } = req.user;
      const { email, name, verified_email } = req.user._json;
      // 檢查用戶是否已存在
      const [googleUser, field] = await connection.execute(
        "SELECT * FROM goals.member WHERE email=?",
        [email]
      );
      if (googleUser.length > 0) {
        const googleMember = {
          id: googleUser[0].id,
          email: googleUser[0].email,
        };
        req.session.isLoggedIn = true;
        req.session.member = googleMember;

        return res.json({
          code: 20004,
          msg: "第三方登入成功",
          data: req.sessionID,
        });
      }

      // 加入新用戶資料到資料庫中
      await connection.execute(
        "INSERT INTO goals.member (email, username, password, valid, verifyString) VALUE (?, ?, ?, ?, ?)",
        [email, name, "socialMedia", verified_email, provider]
      );
      const [newGoogleUser] = await connection.execute(
        "SELECT * FROM goals.member WHERE email=?",
        [email]
      );
      const googleMember = {
        id: newGoogleUser[0].id,
        email: newGoogleUser[0].email,
      };

      req.session.isLoggedIn = true;
      req.session.member = googleMember;

      return res.json({
        code: 20004,
        msg: "第三方登入成功",
        data: req.sessionID,
      });
    } catch (err) {
      console.error(err);
      return res.json({
        code: 30007,
        msg: "Something went wrong, please try again later",
      });
    }
  }
);

/* Facebook token 的中間件 */
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
},
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

router.post('/facebook', passport.authenticate('facebook-token', {session: false}), async(req, res, next) => {
    try{
        const {provider} = req.user;
        const {email, name} = req.user._json;
        // 檢查用戶是否已存在
        const [fbUser, field] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
        if(fbUser.length > 0){
            const fbMember = {
                id: fbUser[0].id,
                email: fbUser[0].email
            }
            req.session.isLoggedIn = true;
            req.session.member = fbMember;

            return res.json({
                code: 20004,
                msg: "第三方登入成功",
                data: req.sessionID
            })
        }
        // 加入新用戶資料到資料庫中
        await connection.execute('INSERT INTO goals.member (email, username, password, valid, verifyString) VALUE (?, ?, ?, ?, ?)', [email, name, "socialMedia", true, provider]);
        const [newFbUser] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
        const fbMember = {
            id: newFbUser[0].id,
            email: newFbUser[0].email
        }
        req.session.isLoggedIn = true;
        req.session.member = fbMember;

        return res.json({
            code: 20004,
            msg: "第三方登入成功",
            data: req.sessionID
        })
    }catch(err){
        return res.json({
            code: 30007,
            msg: "Something went wrong, please try again later"
        })
    }
})

module.exports = router;
