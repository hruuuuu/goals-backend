 const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.post("/getprofile", async (req, res, next) => {
  const {userID} = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if(serverUserID === userID){
  let [data] = await connection.execute(
    "SELECT * FROM goals.member WHERE id=?",
    [serverUserData.member.id]
  );
  res.json(data);
  }
});

router.post("/editprofile", async (req, res, next) => {
  const {userID} = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if(serverUserID === userID){
    let [result] = await connection.execute(
      "UPDATE goals.member SET username=?, email=? ,county=?,district=?,default_address=?, default_tel=? WHERE id=?",
      [
        req.body.username,
        req.body.email,
        req.body.county,
        req.body.district,
        req.body.default_address,
        req.body.default_tel,
        serverUserData.member.id
      ]
    );
  
    res.json({ message: "ok" });
  }

});

router.post("/editpassword", async (req, res, next) => {
  const {userID} = req.body;
  const serverUserID = req.sessionID;
  const serverUserData = req.session;
  if(serverUserID === userID){
    let [result] = await connection.execute(
      "UPDATE goals.member SET password=? WHERE id=?",
      [req.body.newpassword, serverUserData.member.id]
    );
  
    res.json({ message: "ok" });
  }
});

module.exports = router;
