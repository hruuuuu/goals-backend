const connection = require('../utils/database');

// 從資料庫取得user資料
const getUser = async(email) => {
    const [userData] = await connection.execute('SELECT * FROM goals.member WHERE email=?', [email]);
    return userData;
}

// 建立新user資料進資料庫
const createUser = async(email, name, verified_email, provider) => {
    const [newUser] = await connection.execute('INSERT INTO goals.member (email, username, password, valid, verifyString) VALUE (?, ?, ?, ?, ?)', [email, name, "socialMedia", verified_email, provider]);
    return newUser;
}

module.exports={getUser, createUser}