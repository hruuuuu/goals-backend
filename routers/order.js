const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT goals.order_details.id ,create_at , payment_status , order_status, price , amount FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.id INNER JOIN order_status on order_status_id = order_status.id INNER JOIN order_items ON order_items.order_id = goals.order_details.id INNER JOIN product ON product.id = order_items.product_id WHERE goals.order_details.member_id = ?",
    [1]
  );

  res.json(data);
});

module.exports = router;
