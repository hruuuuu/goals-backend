// // 處理資料庫
// const connection = require('../utils/database');
// const productController = require('../controllers/cart');

// const getCartCoupon = async () => {
//   const sql = `SELECT * FROM goals.coupon WHERE valid=1`;
//   const [response, fields] = await connection.execute(sql);
//   return response;
// };

// const getCouponBy = async () => {
//   const sql = `SELECT * FROM goals.activity`;
//   const [response, fields] = await connection.execute(sql);
//   // console.log(data);
//   return response;
// };
// SELECT * FROM coupon where coupon.id NOT IN (SELECT coupon_id from coupon_receive where member_id=?) AND valid =1