const express = require("express");
const router = express.Router();
const connection = require("../utils/database");
const argon2 = require("argon2");
const checkContoller = require("../utils/checkLogin");

router.post(
  "/getprofile",
  checkContoller.checkLogin,
  async (req, res, next) => {
    const serverUserData = req.session;
    let [data] = await connection.execute(
      "SELECT * FROM goals.member WHERE id=?",
      [req.session.member.id]
    );
    res.json(data);
  }
);

router.post("/editprofile", async (req, res, next) => {
  let [result] = await connection.execute(
    "UPDATE goals.member SET username=?, email=? ,county=?,district=?,default_address=?, default_tel=? WHERE id=?",
    [
      req.body.username,
      req.body.email,
      req.body.county,
      req.body.district,
      req.body.default_address,
      req.body.default_tel,
      req.body.id,
    ]
  );
  res.json({ message: "ok" });
});

router.post("/editpassword", async (req, res, next) => {
  // 比對舊密碼
  const verifyPassword = await argon2.verify(
    req.body.password,
    req.body.oldpassword
  );

  if (
    req.body.oldpassword.length == 0 ||
    req.body.newpassword.length == 0 ||
    req.body.confirmpassword.length == 0
  ) {
    res.status(400);
    res.send("密碼欄位不可為空");
  } else if (!verifyPassword) {
    res.status(400);
    res.send("舊密碼輸入錯誤，請確認");
  } else if (req.body.newpassword !== req.body.confirmpassword) {
    res.status(400);
    res.send("新密碼與確認密碼不一致，請確認");
  } else {
    //雜湊新密碼並加入改變資料庫
    const hashPassword = await argon2.hash(req.body.newpassword);

    let [result] = await connection.execute(
      "UPDATE goals.member SET password=? WHERE id=?",
      [hashPassword, req.body.id]
    );
    res.status(200);
    res.send("修改成功");
  }
});

module.exports = router;
