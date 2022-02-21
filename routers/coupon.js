const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

//到資料庫product撈出所有商品資料 -> Products
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM goals.coupon WHERE valid=1;"
  );
  res.json(data);
});

router.get("/receive", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM goals.coupon_receive right JOIN coupon on coupon.id = coupon_id where member_id = ? AND goals.coupon_receive.valid=1;",
    [1]
  );
  res.json(data);
});

module.exports = router;
