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

// 檢查是否為admin
const checkAdmin = async(email) => {
    const [adminData] = await connection.execute('SELECT isAdmin FROM goals.member WHERE email=?', [email]);
    return adminData;
}

module.exports = {getUser, createUser, checkAdmin}