const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const socketio = require('./utils/socketio');

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const expressSession = require('express-session');
let FileStore = require('session-file-store')(expressSession);
app.use(
  expressSession({
    store: new FileStore({
      path: path.join(__dirname, '..', 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

let blogRouter = require('./routers/blog');
app.use('/api/blog', blogRouter);

let memberRouter = require('./routers/member');
app.use('/api/member', memberRouter);

let authRouter = require('./routers/auth');
app.use('/api/auth', authRouter);

let verifyRouter = require('./routers/verify');
app.use('/api/verify', verifyRouter);

let socialRouter = require('./routers/social');
app.use('/api/social', socialRouter);

let commentRouter = require('./routers/comment');
app.use('/api/comment', commentRouter);

let productRouter = require('./routers/product');
app.use('/api/product', productRouter);

let orderRouter = require('./routers/order');
app.use('/api/order', orderRouter);

let couponRouter = require('./routers/coupon');
app.use('/api/coupon', couponRouter);

let cartRouter = require('./routers/cart');
app.use('/api/cart', cartRouter);

// let paymentRouter=require("./routers/payment")
// app.use("/api/payment", paymentRouter);

let favRouter = require('./routers/fav');
app.use('/api/fav', favRouter);

let activityRouter = require('./routers/activity');
app.use('/api/activity', activityRouter);

let dietlogRouter = require('./routers/dietlog');
app.use('/api/dietlog', dietlogRouter);

let foodRouter = require('./routers/food');
app.use('/api/food', foodRouter);

app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('server錯誤');
});

const port = process.env.SERVER_PORT || 3002;
const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});

socketio.initSocket(server);
