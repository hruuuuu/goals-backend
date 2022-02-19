const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/", async (req, res, next) => {
  console.log(req.body);

  let [result] = await connection.execute(
    "UPDATE goals.member SET username=?, email=? WHERE id=?",
    [req.body.name, req.body.email, 1]
  );

  let [result1] = await connection.execute(
    "UPDATE order_details SET address=?, tel=? WHERE id=?",
    [req.body.address, req.body.tel, 1]
  );

  res.json({ message: "ok" });
});

module.exports = router;
