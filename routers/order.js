const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/", async (req, res, next) => {
  const { userID } = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if (serverUserData.member !== null && serverUserID === userID) {
    let [data] = await connection.execute(
      "SELECT * FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.Paymentstatus_id INNER JOIN order_status on order_status_id = order_status.Orderstatus_id WHERE goals.order_details.member_id = ?",
      [serverUserData.member.id]
    );
    res.json(data);
  }
});

// router.post("/", async (req, res, next) => {
//   const {userID} = req.body;
//   const serverUserID = req.sessionID;
//   const serverUserData = req.session;
//   if(serverUserID === userID){
//     let [data] = await connection.execute(
//       "SELECT goals.order_details.id ,create_at , payment_status , order_status, price , amount FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.id INNER JOIN order_status on order_status_id = order_status.id INNER JOIN order_items ON order_items.order_id = goals.order_details.id INNER JOIN product ON product.id = order_items.product_id WHERE goals.order_details.member_id = ?",
//       [serverUserData.member.id]
//     );
//     res.json(data);
//   }
// });

module.exports = router;
