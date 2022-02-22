<<<<<<< HEAD
const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const passport = require('passport');
=======
const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const passport = require("passport");
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480

let app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const expressSession = require("express-session");
let FileStore = require("session-file-store")(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      path: path.join(__dirname, "..", "sessions"),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "assets")));
app.use("/public", express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
let blogRouter = require('./routers/blog');
app.use('/api/blog', blogRouter);

let memberRouter = require('./routers/member');
app.use('/api/member', memberRouter);
=======
let blogRouter = require("./routers/blog");
app.use("/api/blog", blogRouter);

let memberRouter = require("./routers/member");
app.use("/api/member", memberRouter);
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480

let authRouter = require("./routers/auth");
app.use("/api/auth", authRouter);

<<<<<<< HEAD
let orderRouter = require("./routers/order");
app.use("/api/order", orderRouter);
let verifyRouter = require('./routers/verify');
app.use('/api/verify', verifyRouter);

let socialRouter = require('./routers/social');
app.use('/api/social', socialRouter);
=======
let verifyRouter = require("./routers/verify");
app.use("/api/verify", verifyRouter);
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480

let socialRouter = require("./routers/social");
app.use("/api/social", socialRouter);
let productRouter = require("./routers/product");
app.use("/api/product", productRouter);

let orderRouter = require("./routers/order");
app.use("/api/order", orderRouter);

let couponRouter = require("./routers/coupon");
app.use("/api/coupon", couponRouter);
<<<<<<< HEAD

let cartRouter = require('./routers/cart');
app.use('/api/cart', cartRouter);
 
let favRouter = require('./routers/fav');
app.use('/api/fav', favRouter);

let activityRouter = require('./routers/activity');
app.use('/api/activity', activityRouter);
=======

let favRouter = require("./routers/fav");
app.use("/api/fav", favRouter);

let activityRouter = require("./routers/activity");
app.use("/api/activity", activityRouter);
>>>>>>> 3c0134f95463aac585b153d02acf31ba7b35d480

app.use((req, res, next) => {
  res.status(404).send("404 not found");
});

app.use((err, req, res, next) => {
  res.status(500).send("server錯誤");
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
