const connection = require('../utils/database');

const getComment = async(product_id) => {
    const [commentData] = await connection.execute('SELECT * FROM goals.comments WHERE product_id = ? ORDER BY create_at DESC', [product_id]);
    return commentData;
}

const checkOrder = async(product_id, user_id) => {
    // 將order_items 跟 order_details 透過order_items的order_id跟order_details的id做關聯
    const [checkResult] = await connection.execute('SELECT goals.order_items.product_id, goals.order_details.member_id FROM goals.order_items INNER JOIN order_details ON order_items.order_id = order_details.id WHERE product_id = ? AND member_id = ?', [product_id, user_id]);
    return checkResult;
}

const addComment = async(product_id, user_id, user_email, comment, date) => {
    // 檢查是否已有同天同商品同一人的評論存在
    const [checkComment] = await connection.execute('SELECT product_id, member_id FROM goals.comments WHERE create_at = ? AND member_id = ? AND product_id = ?', [date, user_id, product_id]);
    if(checkComment.length !== 0){
        return checkComment;
    }else{
        const [newComment] = await connection.execute('INSERT INTO goals.comments (product_id, member_id, member_email, comment, create_at, isComment) VALUES (?, ?, ?, ?, ?, ?)', [product_id, user_id, user_email,comment, date, 0]);
        return newComment;
    }
}

module.exports = {getComment, checkOrder, addComment}