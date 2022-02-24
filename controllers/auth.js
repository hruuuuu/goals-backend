const argon2 = require('argon2');
const sgMail = require('@sendgrid/mail');
const randomString = require('randomstring');
const authModel = require('../models/auth');

const userLogin = async(req, res, next) => {
    // 獲取前端送來的email, password
    const {email, password} = req.body;
    // 等待 model 獲取 user 資料
    const [user] = await authModel.getUser(email);
    if(user === undefined){
        return res.json({
            code: 30000,
            msg: "此用戶不存在"
        })
    }
    
    if(user.valid === 0){
        return res.json({
            code: 30001,
            msg: "尚未通過帳戶驗證"
        })
    }

    // 驗證密碼
    const verifyPassword = await argon2.verify(user.password, password);
    if(!verifyPassword){
        return res.json({
            code: 30002,
            msg: "帳號或密碼錯誤"
        })
    }

    const loginMember = {
        id: user.id,
        email: user.email
    }

    // req.session.isLoggedIn = true;
    req.session.member = loginMember;
    // res.redirect('http://localhost:3000')

    return res.json({
        code: 20004,
        msg: "會員登入成功",
        data: loginMember
    })
} 

const userSignUp = async(req, res, next) => {
    // 取得前端用戶輸入之資料
    const {email, password} = req.body;
    // 檢查用戶是否已存在
    const user = await authModel.getUser(email);
    if(user.length > 0){
        return res.json({
            code: 30003,
            msg: "此用戶已存在"
        })
    }

    // 產生指定長度的隨機字串(用於驗證)
    const verifyCode = randomString.generate(10);

    // 產生時間戳記
    const joinTime = new Date();
    const joinTimeStamp = Math.floor(joinTime / 1000);

    // 寄送驗證信設定
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: "Goals Function <goalsfoods@gmail.com>",
        subject: "歡迎您註冊果實網站",
        text: "您好，請點選以下連結進行驗證",
        html: `
        <div>
            <a href=${process.env.SERVER_PORT}/api/verify/v=${verifyCode}&t=${joinTimeStamp}>請點此處進行驗證</a>
            <p>或是直接複製下列網址貼到瀏覽器上做驗證</p>
            <span>${process.env.SERVER_PORT}/api/verify/v=${verifyCode}&t=${joinTimeStamp}</span>
        </div>
            `
    };

    const sendMail = async() => {
        try{
            await sgMail.send(msg);
        }catch(error){
            console.error(error);
            // if (error.response) {
            //     console.error(error.response.body)
            // }
        }
    }

    // 對密碼加密
    const hashPassword = await argon2.hash(password);

    // 加入新用戶資料到資料庫中
    await authModel.createUser(email, hashPassword, verifyCode, joinTime);

    sendMail();
    return res.json({
        code: 20000,
        msg: "註冊成功，請至您的信箱收取驗證信以驗證身份"
    });
}

const userLogout = (req, res, next) => {
    req.session.destroy();
    // res.clearCookie('connect.sid');
    return res.json({
        code: 20005,
        msg: "會員登出成功"
    })
}

module.exports = {userLogin, userSignUp, userLogout}