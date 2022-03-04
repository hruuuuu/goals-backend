const commentModel = require('../models/comment');

const checkEligible = async(req, res, next) => {
    const {product_id} = req.body;
    const serverUserData = req.session;
    if(serverUserData.member){
        const {id} = serverUserData.member;
        // 檢查用戶是否有對該商品進行購買
        const checkEligible = await commentModel.checkOrder(product_id, id);
        if(checkEligible.length > 0){
            return res.json({
                code: 30021,
                status: true //已購買商品，可評論
            })
        }else{
            return res.json({
                code: 30011,
                status: false //未購買商品，不可評論
            })
        }
    }
}

const findComments = async(req, res, next) => {
    const {product_id} = req.body;
    const comments = await commentModel.getComment(product_id);
    res.json({
        data: comments
    })
}

const addNewComment = async(req, res, next) => {
    const {product_id, newComment, date} = req.body;
    const serverUserData = req.session;
    if(serverUserData.member){
        const {id, email} = serverUserData.member;
        // 檢查用戶是否已對同一商品於同一天提交過評論
        const comment = await commentModel.addComment(product_id, id, email, newComment, date);
        if(comment.length > 0){
            return res.json({
                code: 30012,
                msg: "同一天同一會員只能對同一商品評論一次"
            })
        }else{
            return res.json({
                code: 30022,
                msg: "提交評論成功"
            })
        }
    }
    
}

module.exports = {checkEligible, findComments, addNewComment}