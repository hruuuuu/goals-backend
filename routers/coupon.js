const express = require("express");
const router = express.Router();
const connection = require("../utils/database");
const checkContoller = require('../utils/checkLogin');

//撈出全部的優惠券(valid=1)
router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM goals.coupon WHERE valid=1;"
  );
  res.json(data);
});

//撈出可領取的優惠券(使用者沒有的)
router.post("/get", checkContoller.checkLogin, async (req, res, next) => {
  const serverUserData = req.session;
    let [data] = await connection.execute(
      "SELECT * FROM coupon where coupon.id NOT IN (SELECT coupon_id from coupon_receive where member_id=?) AND valid =1",
      [serverUserData.member.id]
    );
  
    res.json(data);
});

//使用者擁有的優惠券
router.post("/receive",  checkContoller.checkLogin, async (req, res, next) => {
  const serverUserData = req.session;
    let [data] = await connection.execute(
      "SELECT * FROM goals.coupon_receive right JOIN coupon on coupon.id = coupon_id where member_id = ? AND goals.coupon_receive.valid=1;",
      [serverUserData.member.id]
    );
    res.json(data);
});

//使用者擁有的優惠券但已失效

router.post("/invalid", checkContoller.checkLogin, async (req, res, next) => {

  const serverUserData = req.session;
    let [data] = await connection.execute(
      "SELECT * FROM goals.coupon_receive right JOIN coupon on coupon.id = coupon_id where member_id = ? AND goals.coupon_receive.valid=0;",
      [serverUserData.member.id]
    );
    res.json(data);
});

//領取優惠券
router.post("/post", async (req, res, next) => {
  const date = new Date();

  let [data] = await connection.execute(
    "INSERT INTO goals.coupon_receive (member_id ,coupon_id,receive_time,valid) VALUE (?,?,?,?)",
    [req.body.member_id, req.body.coupon_id, date, 1]
  );

  let [data1] = await connection.execute(
    "UPDATE coupon SET amount=amount-1 where id = ? ",
    [req.body.coupon_id]
  );

  res.json({
    msg: "ok",
  });
});

module.exports = router;
