const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute("SELECT * FROM goals.order_details");
  //   console.log(setData);

  //   console.log(data[0].tel);
  res.json(data);
});

module.exports = router;
