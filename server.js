const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

let app = express();

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

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

let memberRouter = require('./routers/member');
app.use('/api/member', memberRouter);

let authRouter = require('./routers/auth');
app.use('/api/auth', authRouter);

let productRouter = require('./routers/product');
app.use('/api/product', productRouter);

app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('server錯誤');
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
