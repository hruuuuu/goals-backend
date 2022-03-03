const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/", async (req, res, next) => {
  // console.log(req.body);
  const { userID } = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if (serverUserID === userID) {
    let [data] = await connection.execute(
      "SELECT * FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.Paymentstatus_id INNER JOIN order_status on order_status_id = order_status.Orderstatus_id WHERE goals.order_details.member_id = ?",
      [serverUserData.member.id]
    );
    res.json(data);
  }
});

router.post("/orderdetail", async (req, res, next) => {
  // const { userID } = req.body;
  // const serverUserID = req.sessionID;
  // const serverUserData = req.session;
  // if (serverUserID === userID) {
  let [data] = await connection.execute(
    "SELECT * FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.Paymentstatus_id INNER JOIN order_status on order_status_id = order_status.Orderstatus_id INNER JOIN order_items ON order_items.order_id = goals.order_details.id INNER JOIN product ON product.id = order_items.product_id WHERE goals.order_details.member_id = ? and goals.order_details.id = ?",
    [req.body.member_id, req.body.id]
  );
  res.json(data);
  // }
});

module.exports = router;
