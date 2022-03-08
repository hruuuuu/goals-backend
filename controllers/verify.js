const alert = require('alert');
const sgMail = require('@sendgrid/mail');
const randomString = require('randomstring');
const argon2 = require('argon2');
const verifyModel = require('../models/verify');

const resendEmail = async(req, res, next) => {
    try{
        const {email} = req.body;

        // 檢查用戶是否已存在
        const [user] = await verifyModel.getUser(email);
        if(user === undefined){
            return res.json({
                code: 30000,
                msg: "該用戶不存在"
            })
        }

        // 產生指定長度的隨機字串(用於驗證)
        const verifyCode = randomString.generate(10);

        // 設定時間戳記
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
                    msg: "Something went wrong, please try again later."
                })
            }
        }

        // 更新用戶用於驗證的驗證碼，時間戳記
        await verifyModel.resendEmailSetVerify(verifyCode, joinTime, email);
        sendMail();
    
        return res.json({
            code: 20001,
            msg: "新的驗證信已寄出"
        })
    }catch(err){
        console.error(err);
        return res.json({
            code: 30006,
            msg: "Something went wrong, please try again later."
        })
    }
}

const forgetEmail = async(req, res, next) => {
    try{
        const {email} = req.body;

        // 檢查用戶是否已存在
        const [user] = await verifyModel.getUser(email);
        if(user === undefined){
            return res.json({
                code: 30000,
                msg: "該用戶不存在"
            })
        }

        // 產生指定長度的隨機字串(用於驗證)
        const verifyCode = randomString.generate(10);

        // 寄送驗證信設定
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: "Goals Function <goalsfoods@gmail.com>",
            subject: "果實網站-密碼重置",
            text: "您好，請點選以下連結進行重置密碼",
            html: `
        <div>
            <a href=${process.env.FRONTEND_URL}/reset/m=${email}&v=${verifyCode}>請點此處重置密碼</a>
            <p>或是直接複製下列網址貼到瀏覽器上重置密碼</p>
            <span>${process.env.FRONTEND_URL}/reset/m=${email}&v=${verifyCode}</span>
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
                    msg: "Something went wrong, please try again later."
                })
            }
        }

        // 更新用戶用於驗證的驗證碼
        await verifyModel.resetPasswordSetVerify(verifyCode, email);
        sendMail();
        return res.json({
            code: 20002,
            msg: "重設密碼信已寄出"
        })
    }catch(err){
        console.error(err);
        return res.json({
            code: 30006,
            msg: "Something went wrong, please try again later"
        })
    }
}

const resetEmail = async(req, res, next) => {
    try{
        const {email, password, verifyString} = req.body;
        const [user] = await verifyModel.getUser(email);
        if(user.verifyString !== verifyString){
            return res.json({
                code: 30005,
                msg: "不明錯誤"
            });
        }
        const checkPassword = await argon2.verify(user.password, password);
        if(checkPassword){
            return res.json({
                code: 30004,
                msg: "密碼不可與之前的相同"
            })
        }

        const newHashPassword = await argon2.hash(password);

        const updatePassword = await verifyModel.updatePassword(newHashPassword, email);
            if(updatePassword.warningStatus === 0){
                return res.json({
                    code: 20003,
                    msg: "密碼更新成功"
                });
            }
        }catch(err){
            console.error(err);
            return res.json({
                code: 30006,
                msg: "Something went wrong, please try again later"
            })
        }
    }

const getVerifyString = async(req, res, next) => {
    try{
        const {verifyString} = req.params;
        const verifyStr = verifyString.split('&')[0].split('=')[1];
        const signupTimeStamp = verifyString.split('&')[1].split('=')[1];
        const currentTime = new Date().getTime();
        const currentTimeStamp = Math.floor(currentTime / 1000);
        const checkTimeDiff = (signupTimeStamp, currentTimeStamp) => {
            const timeDiff = currentTimeStamp - signupTimeStamp;
            const minuteCheck = timeDiff % 3600 / 60;
            return minuteCheck;
        }

        if(checkTimeDiff(signupTimeStamp, currentTimeStamp) > 5){
            alert("已超時驗證，請重新請求驗證信")
            res.redirect(process.env.FRONTEND_URL);
            return;
        }else{
            const [checkStatus] = await verifyModel.isValid(verifyStr);
                if(checkStatus.valid === 1){
                    alert("此電子信箱已驗證過")
                    res.redirect(process.env.FRONTEND_URL);
                    return;
                }
            const setVerify = await verifyModel.inValid(verifyStr);
                console.log(setVerify);
                if(setVerify.warningStatus === 0){
                    alert("驗證成功")
                    res.redirect(process.env.FRONTEND_URL);
                    return;
                }    
        }
    }catch(err){
        console.error(err);
        return res.json({
            code: 30006,
            msg: "Something went wrong, please try again later"
        })
    }
}

module.exports = {resendEmail, forgetEmail, resetEmail, getVerifyString}