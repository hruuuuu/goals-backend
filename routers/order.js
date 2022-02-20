const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM goals.order_details INNER JOIN payment_status on payment_status_id = payment_status.id WHERE goals.order_details.id = ?",
    [1],

    "SELECT * FROM goals.order_details LEFT JOIN order_status on order_status_id = order_status.id WHERE goals.order_details.id = ?"[1]
  );

  res.json(data);
});

module.exports = router;
