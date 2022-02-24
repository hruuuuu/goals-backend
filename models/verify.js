// model負責處理資料庫
const connection = require('../utils/database');

// 從資料庫取得user資料
const getUser = async(email) => {
    const [userData] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
    return userData;
}

// 更新用戶用於驗證的驗證碼，時間戳記
const resendEmailSetVerify = async(verifyCode, joinTime, email) => {
    const [updateVerifyData] = await connection.execute('UPDATE goals.member SET verifyString=?, timeStamp=? WHERE email=?', [verifyCode, joinTime, email]);
    return updateVerifyData;
}

// 更新用戶用於驗證的驗證碼
const resetPasswordSetVerify = async(verifyCode, email) => {
    const [newVerifyString] = await connection.execute('UPDATE goals.member SET verifyString=? WHERE email=?', [verifyCode, email]);
    return newVerifyString;
}

// 更新用戶的密碼
const updatePassword = async(newHashPassword, email) => {
    const [newPassword] = await connection.execute('UPDATE goals.member SET password = ? WHERE email = ?', [newHashPassword, email]);
    return newPassword;
}

// 用戶已驗證
const isValid = async(verifyStr) => {
    const [alreadyValid] = await connection.execute('SELECT valid FROM goals.member WHERE verifyString=?', [verifyStr]);
    return alreadyValid;
}

// 用戶未驗證，經驗證後設定為已驗證
const inValid = async(verifyStr) => {
    const [notValid] = await connection.execute('UPDATE goals.member SET valid=1 WHERE verifyString=?', [verifyStr]);
    console.log(notValid)
    return notValid;
}


module.exports={getUser, resendEmailSetVerify, resetPasswordSetVerify, updatePassword, isValid, inValid}