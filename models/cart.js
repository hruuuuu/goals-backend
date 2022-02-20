//處理資料庫
const connection = require('../utils/database');

const getProducts = async () => {
  let [data, fields] = await connection.execute(
    'SELECT * FROM goals.product WHERE valid = 1'
  );
  console.log(data);
  return data;
};

const getActivity = async () => {
    let [data, fields] = await connection.execute(
      'SELECT * FROM goals.activity WHERE valid = 1'
    );
    console.log(data);
    return data;
  };

  const getCoupons = async () => {
    let [data, fields] = await connection.execute(
      'SELECT * FROM goals.coupon WHERE valid = 1'
    );
    console.log(data);
    return data;
  };

  const getCouponByMemberId = async (memberId) => {
    let [data, fields] = await connection.execute(
      'SELECT * FROM goals.coupon_receive WHERE valid = 1 AND member_id = ?',
      [memberId]
    );
    console.log(data);
    return data;
  };

  module.exports = {
    getProducts,
    getActivity,
    getCoupons,
    getCouponByMemberId,
  };