const express = require("express");
const router = express.Router();
const connection = require("../utils/database");
const argon2 = require("argon2");
const alert = require("alert");

router.post("/getprofile", async (req, res, next) => {
  const { userID } = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if (serverUserData.member !== null && serverUserID === userID) {
    let [data] = await connection.execute(
      "SELECT * FROM goals.member WHERE id=?",
      [serverUserData.member.id]
    );
    res.json(data);
  }
});

router.post("/editprofile", async (req, res, next) => {
  // const {userID} = req.body;
  // const serverUserID = req.sessionID;
  // const serverUserData = req.session;
  // if(serverUserID === userID){
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
  // }
});

router.post("/editpassword", async (req, res, next) => {
  // const { userID } = req.body;
  // const serverUserID = req.sessionID;
  // const serverUserData = req.session;
  // console.log("123");
  // console.log(req.body);
  // console.log(req.sessionID);
  // console.log(req.session);

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
    alert("有欄位未填入，請確認");
  } else if (!verifyPassword) {
    alert("舊密碼輸入錯誤");
    return res.status(400).json({
      msg: "舊密碼輸入錯誤",
    });
  } else if (req.body.newpassword !== req.body.confirmpassword) {
    alert("新密碼與確認密碼不一致，請確認");
    return res.status(400).json({
      msg: "新密碼與確認密碼不一致，請確認",
    });
  } else {
    //雜湊新密碼並加入改變資料庫
    const hashPassword = await argon2.hash(req.body.newpassword);

    let [result] = await connection.execute(
      "UPDATE goals.member SET password=? WHERE id=?",
      [hashPassword, req.body.id]
    );
    alert("修改成功");
    return res.status(200).json({
      msg: "修改成功",
    });
  }
});

module.exports = router;
