const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

//取得運送方式delivery
router.post("/deliveryMethod", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM goals.delivery");

  res.json(data);
});

//order_items
// router.post("/orderItems", async (req, res, next)=>{
//     let [result] = await connection.execute(
//         "INSERT INTO `goals.order_items` (order_id, product_id, amount, amount)VALUES("?","?","?","?")",
//         [
//           req.body.order_id,
//           req.body.product_id,
//           req.body.amount,
//           req.body.amount,
//         ]
//       );
    
//       res.json({ message: "ok" });
// }):
//order_details
// router.post("/", async (req, res, next) => {
//   let [result] = await connection.execute(
//     "UPDATE goals.order_details SET member_id=?, name=?, total=?, delivery_id=?, county=?, district=?, address=?, payment_id=?, payment_status_id=?, delivery_status_id=?, recipient=?, tel=? , order_status_id=?, create_at=?, coupon_id=?",
//     [
//       req.body.member_id,
//       req.body.name,
//       req.body.total,
//       req.body.delivery_id,
//       req.body.district,
//       req.body.default_address,
//       req.body.default_tel,
//       req.body.id,
//     ]
//   );

//   res.json({ message: "ok" });
// });

//coupon-receive

module.exports = router;
