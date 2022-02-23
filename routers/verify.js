const express = require('express');
const router = express.Router();
const connection = require('../utils/database');
const alert = require('alert');
const sgMail = require('@sendgrid/mail');
const randomString = require('randomstring');
const argon2 = require('argon2');

router.post('/resend', async (req, res, next) => {
  const { email } = req.body;

  // 檢查用戶是否已存在
  const [userCheck] = await connection.execute(
    'SELECT * FROM goals.member WHERE email=?',
    [email]
  );
  if (userCheck.length === 0) {
    alert('該用戶不存在');
    return res.status(400).json({
      msg: '該用戶不存在',
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

  const updateData = await connection.execute(
    'UPDATE goals.member SET verifyString=?, timeStamp=? WHERE email=?',
    [verifyCode, joinTime, email]
  );
  // console.log(updateData);
  sendMail();
  alert('新的驗證信已寄出');
  res.json({
    msg: '新的驗證信已寄出',
  });
});

router.post('/forget', async (req, res, next) => {
  const { email } = req.body;

  // 檢查用戶是否已存在
  const [userCheck] = await connection.execute(
    'SELECT * FROM goals.member WHERE email=?',
    [email]
  );
  if (userCheck.length === 0) {
    alert('該用戶不存在');
    return res.status(400).json({
      msg: '該用戶不存在',
    });
  }

  // 產生指定長度的隨機字串(用於驗證)
  const verifyCode = randomString.generate(10);

  // 寄送驗證信設定
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'Goals Function <goalsfoods@gmail.com>',
    subject: '歡迎您註冊果實網站',
    text: '您好，請點選以下連結進行重置密碼',
    html: `
        <div>
            <a href=http://localhost:3000/reset/m=${email}&v=${verifyCode}>請點此處重置密碼</a>
            <p>或是直接複製下列網址貼到瀏覽器上重置密碼</p>
            <span>http://localhost:3000/reset/m=${email}&v=${verifyCode}</span>
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

  const updateData = await connection.execute(
    'UPDATE goals.member SET verifyString=? WHERE email=?',
    [verifyCode, email]
  );
  // console.log(updateData);
  sendMail();
  alert('已寄出重設密碼信件');
  res.json({
    msg: '已寄出重設密碼信件',
  });
});

router.post('/reset/', async (req, res, next) => {
  const { email, password, verifyString } = req.body;
  try {
    const [passwordCheck] = await connection.execute(
      'SELECT * FROM goals.member WHERE email=?',
      [email]
    );
    if (passwordCheck[0].verifyString !== verifyString) {
      alert('不明錯誤');
      return res.status(400).json({
        msg: '不明錯誤',
      });
    }
    const checkPassword = await argon2.verify(
      passwordCheck[0].password,
      password
    );
    if (checkPassword) {
      alert('密碼不可與之前的相同');
      return res.status(400).json({
        msg: '密碼不可與之前的相同',
      });
    }

    const newPassword = await argon2.hash(password);

    const [updatePassword] = await connection.execute(
      'UPDATE goals.member SET password = ? WHERE email = ?',
      [newPassword, email]
    );
    if (updatePassword.warningStatus === 0) {
      alert('密碼更新成功');
      return res.status(200).json({
        msg: '密碼更新成功',
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get('/:verifyString', async (req, res, next) => {
  const { verifyString } = req.params;
  const verifyStr = verifyString.split('&')[0].split('=')[1];
  const signupTimeStamp = verifyString.split('&')[1].split('=')[1];
  const currentTime = new Date().getTime();
  const currentTimeStamp = Math.floor(currentTime / 1000);
  const checkTimeDiff = (signupTimeStamp, currentTimeStamp) => {
    const timeDiff = currentTimeStamp - signupTimeStamp;
    const minuteCheck = (timeDiff % 3600) / 60;
    return minuteCheck;
  };

  if (checkTimeDiff(signupTimeStamp, currentTimeStamp) > 5) {
    alert('驗證信鏈結已超時，請重新請求驗證');
    res.redirect('http://127.0.0.1:3000/');
    return;
  } else {
    try {
      const [checkStatus] = await connection.execute(
        'SELECT valid FROM goals.member WHERE verifyString=?',
        [verifyStr]
      );
      if (checkStatus[0].valid === 1) {
        alert('您的電子信箱已驗證過');
        res.redirect('http://127.0.0.1:3000/');
        return;
      }
      const [setVerify] = await connection.execute(
        'UPDATE goals.member SET valid=1 WHERE verifyString=?',
        [verifyStr]
      );
      if (setVerify.warningStatus === 0) {
        alert('電子信箱驗證成功');
        res.redirect('http://127.0.0.1:3000/');
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }
});

module.exports = router;
