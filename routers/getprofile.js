const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", async (req, res, next) => {
  let [data] = await connection.execute(
    "SELECT * FROM goals.member WHERE id=?",
    [1]
  );

  res.json(data);
});

module.exports = router;
