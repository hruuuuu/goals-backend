const express = require('express');
const router = express.Router();
const connection = require('../utils/database');
const argon2 = require('argon2');
const sgMail = require('@sendgrid/mail');
const randomString = require('randomstring');
const alert = require('alert');

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const [userCheck] = await connection.execute(
    'SELECT * FROM goals.member WHERE email=?',
    [email]
  );
  if (userCheck.length === 0) {
    alert('此用戶不存在');
    return res.status(400).json({
      msg: '此用戶不存在',
    });
  }

  if (userCheck[0].valid === 0) {
    alert('尚未通過帳戶驗證');
    return res.status(400).json({
      msg: '尚未通過帳戶驗證',
    });
  }

  const user = userCheck[0];
  // 驗證密碼
  const verifyPassword = await argon2.verify(user.password, password);
  if (!verifyPassword) {
    alert('帳號或密碼錯誤');
    return res.status(400).json({
      msg: '帳號或密碼錯誤',
    });
  }

  const loginMember = {
    id: user.id,
    email: user.email,
  };

  req.session.member = loginMember;

  res.json({
    data: loginMember,
  });
});

router.post('/signup', async (req, res, next) => {
  // 取得前端用戶輸入之資料
  const { email, password } = req.body;

  // 檢查用戶是否已存在
  const [userCheck] = await connection.execute(
    'SELECT * FROM goals.member WHERE email=?',
    [email]
  );
  if (userCheck.length > 0) {
    alert('此用戶已存在');
    return res.json({
      msg: '此用戶已存在',
    });
  }

  // 產生指定長度的隨機字串(用於驗證)
  const verifyCode = randomString.generate(10);
  const joinTime = new Date();
  const joinTimeStamp = Math.floor(joinTime / 1000);

  // 寄送驗證信設定
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'Goals Function <goalsfoods@gmail.com>',
    subject: '歡迎您註冊果實網站',
    text: '您好，請點選以下連結進行驗證',
    html: `
        <div>
            <a href=http://localhost:3002/api/verify/v=${verifyCode}&t=${joinTimeStamp}>請點此處進行驗證</a>
            <p>或是直接複製下列網址貼到瀏覽器上做驗證</p>
            <span>http://localhost:3002/api/verify/v=${verifyCode}&t=${joinTimeStamp}</span>
        </div>
            `,
  };

  const sendMail = async () => {
    try {
      const sendResult = await sgMail.send(msg);
      // console.log(sendResult);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  };

  // 對密碼加密
  const hashPassword = await argon2.hash(password);

  // 加入新用戶資料到資料庫中
  const newAccount = await connection.execute(
    'INSERT INTO goals.member (email, password, verifyString, valid, timeStamp) VALUE (?, ?, ?, ?, ?)',
    [email, hashPassword, verifyCode, 0, joinTime]
  );
  // console.log(newAccount);
  sendMail();
  alert('註冊成功');
  return res.json({
    msg: '新增用戶成功',
  });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  return res.json({
    msg: '會員登出成功',
  });
});

module.exports = router;
