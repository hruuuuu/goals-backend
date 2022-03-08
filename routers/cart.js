const express = require("express");
const router = express.Router();
const connection = require("../utils/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const calculateOrderAmount = (products) => {
  let total = 0;
  products.map((product) => {
    total += product.discountPrice;
  });
  return total;
};

router.post("/create-payment-intent", async (req, res, next) => {
  const products = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(products),
    currency: "USD",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

//取得運送方式delivery
router.post("/deliveryMethod", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM goals.delivery");

  res.json(data);
});

//order_items;
router.post("/orderItems", async (req, res, next) => {
  let data = req.body;

  let [lastorder] = await connection.execute(
    "SELECT id FROM goals.order_details ORDER BY id DESC LIMIT 1;"
  );

  for (let i = 0; i < Object.keys(data).length; i++) {
    let [result] = await connection.execute(
      "INSERT INTO goals.order_items (order_id,product_id, amount)VALUES(?,?,?)",
      [lastorder[0].id, data[i].id, data[i].amount]
    );
  }

  res.json({ message: "ok" });
});

//order_details
router.post("/orderDetails", async (req, res, next) => {
  // console.log(req.body);

  const date = new Date();

  let [result] = await connection.execute(
    "INSERT INTO goals.order_details (purchaser,total,delivery_id,member_id,county,district,address,payment_id,payment_status_id,delivery_status_id,recipient,tel,order_status_id,create_at) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.purchaser,
      req.body.total,
      req.body.delivery_id,
      req.body.member_id,
      req.body.county,
      req.body.district,
      req.body.address,
      req.body.payment_id,
      req.body.payment_status_id,
      req.body.delivery_status_id,
      req.body.recipient,
      req.body.tel,
      req.body.order_status_id,
      date,
    ]
  );

  res.json({ message: "ok" });
});

//改優惠券狀態

router.post("/orderItemsCoupon", async (req, res, next) => {
  if (req.body.coupon_id !== 0) {
    let [result] = await connection.execute(
      "UPDATE coupon_receive SET valid=0 where member_id = ? AND coupon_id=?",
      [req.body.member_id, req.body.coupon_id]
    );

    res.json({
      msg: "ok",
    });
  } else {
    res.json({
      msg: "輸入優惠券為0",
    });
  }
});

//coupon-receive

module.exports = router;
