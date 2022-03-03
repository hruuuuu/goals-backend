const argon2 = require('argon2');
const sgMail = require('@sendgrid/mail');
const randomString = require('randomstring');
const authModel = require('../models/auth');

const checkUser = (req, res, next) => {
    return res.json({
        status: req.session.isLoggedIn,
        user: req.sessionID,
        administrator: req.session.isAdmin
    })
}

const userLogin = async(req, res, next) => {
    try{
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

        // 檢查是否為admin
        const [admin] = await authModel.checkAdmin(email);

        const loginMember = {
            id: user.id,
            email: user.email
        }

        if(admin.isAdmin === 1){
            req.session.isLoggedIn = true;
            req.session.member = loginMember;
            req.session.isAdmin = true;
        }else{
            req.session.isLoggedIn = true;
            req.session.member = loginMember;
            req.session.isAdmin = false;
        }
    
        return res.json({
            code: 20004,
            msg: "會員登入成功",
            data: req.sessionID,
        })

    }catch(err){
        console.error(err);
        return res.json({
            code: 30006,
            msg: "Something went wrong, please try again later"
        })
    }
} 

const userSignUp = async(req, res, next) => {
    try{
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
                <a href=${process.env.MAILING_URL}/api/verify/v=${verifyCode}&t=${joinTimeStamp}>請點此處進行驗證</a>
                <p>或是直接複製下列網址貼到瀏覽器上做驗證</p>
                <span>${process.env.MAILING_URL}/api/verify/v=${verifyCode}&t=${joinTimeStamp}</span>
            </div>
            `
        };

        const sendMail = async() => {
            try{
                await sgMail.send(msg);
            }catch(err){
                console.error(err);
                return res.json({
                    code: 30006,
                    msg: "Something went wrong, please try again later"
                })
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

    }catch(err){
        console.error(err);
        return res.json({
            code: 30006,
            msg: "Something went wrong, please try again later"
        })
    }
}

const userLogout = async(req, res, next) => {
    req.session.isLoggedIn = false;
    req.session.isAdmin = false;
    req.session.member = null;
    return res.json({
        code: 20005,
        msg: "會員登出成功"
    })
}

module.exports = {checkUser, userLogin, userSignUp, userLogout}