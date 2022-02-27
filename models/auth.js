// model負責處理資料庫
const connection = require('../utils/database');

// 從資料庫取得user資料
const getUser = async(email) => {
    const [userData] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
    return userData;
}

// 建立新user資料進資料庫
const createUser = async(email, hashPassword, verifyCode, joinTime) => {
    const [newUser] = await connection.execute('INSERT INTO goals.member (email, password, verifyString, valid, timeStamp) VALUE (?, ?, ?, ?, ?)', [email, hashPassword, verifyCode, 0, joinTime]);
    return newUser;
}

module.exports = {getUser, createUser}