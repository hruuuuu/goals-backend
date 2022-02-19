const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/", async (req, res, next) => {
  console.log(req.body);

  let [result] = await connection.execute(
    "UPDATE goals.member SET password=? WHERE id=?",
    [req.body.newpassword, 1]
  );

  //   console.log(data[0].tel);
  res.json({ message: "ok" });
  // res("hello");
});

module.exports = router;
