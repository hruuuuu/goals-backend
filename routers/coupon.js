const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

//到資料庫coupon撈出所有商品資料 -> Products
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM goals.coupon;");
  res.json(data);
});
//到資料庫coupon_receive撈出會員折價券狀況
router.get("/receive", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM goals.coupon_receive;");
  res.json(data);
});

module.exports = router;
