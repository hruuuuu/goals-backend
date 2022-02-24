const socialModel = require('../models/social');

const googleUser = async(req, res, next) => {
    const {provider} = req.user;
    const {email, name, verified_email} = req.user._json;

    // 檢查用戶是否已存在
    const [user] = await socialModel.getUser(email);
    if(user.length > 0){
        alert("此用戶已存在")
        return res.json({
            msg: "此用戶已存在"
        })
    }

    // 加入新用戶資料到資料庫中
    const newAccount = await socialModel.createUser(email, name, verified_email, provider); 
    
    // const googleMember = {
    //     id: newAccount.id,
    //     email: newAccount.email
    // }

    // req.session.member = googleMember;

    alert("第三方登入成功");

    res.status(201).json({
        msg: "第三方登入成功",
        data: newAccount
    })
}

const socialLogout = async(req, res, next) => {
    req.logout();
    // res.redirect('/')
    return res.json({
        msg: "會員登出成功"
    })
}

module.exports ={googleUser, socialLogout}