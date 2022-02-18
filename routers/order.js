const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/", async (req, res, next) => {
  // let [data] = await connection.execute("SELECT * FROM goals.order_details");
  //   console.log(setData);
  console.log(req.body);

  let [result] = await connection.execute(
    "UPDATE goals.member SET username=?, email=? WHERE id=?",
    [req.body.name, req.body.email, 1]
  );

  let [result1] = await connection.execute(
    "UPDATE order_details SET address=?, tel=? WHERE id=?",
    [req.body.address, req.body.tel, 1]
  );

  //   console.log(data[0].tel);
  res.json({ message: "ok" });
  // res("hello");
});

module.exports = router;
