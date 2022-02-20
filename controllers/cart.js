//處理商業行為
const cartModel = require('../models/cart');

const getProducts = async (req, res, next) => {
      const data = await cartModel.getProducts();
      res.json(data);
  };

  const getActivity = async (req, res, next) => {
    const data = await cartModel.getActivity();
    res.json(data);
  };

  const getCoupons = async (req, res, next) => {
    const data = await cartModel.getCoupons();
    res.json(data);
  };

  const getCouponByMemberId = async (req, res, next) => {
    const data = await cartModel.getCouponByMemberId();
    res.json(data);
  };

module.exports = { getProducts, getActivity, getCoupons, getCouponByMemberId };
