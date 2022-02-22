const express = require('express');
const router = express.Router();
const connection = require('../utils/database');

router.get('/getprofile', async (req, res, next) => {
  let [data] = await connection.execute(
    'SELECT * FROM goals.member WHERE id=?',
    [1]
  );
  res.json(data);
});

router.post('/editprofile', async (req, res, next) => {
  // console.log(req.body);

  let [result] = await connection.execute(
    'UPDATE goals.member SET username=?, email=? ,default_address=?, default_tel=? WHERE id=?',
    [
      req.body.username,
      req.body.email,
      req.body.default_address,
      req.body.default_tel,
      1,
    ]
  );

  res.json({ message: 'ok' });
});

router.post('/editpassword', async (req, res, next) => {
  // console.log(req.body);

  let [result] = await connection.execute(
    'UPDATE goals.member SET password=? WHERE id=?',
    [req.body.newpassword, 1]
  );

  res.json({ message: 'ok' });
});

module.exports = router;
