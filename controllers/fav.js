//處理商業行為
const favModel = require('../models/fav');
const productModel = require('../models/product');

const getDiscountPrice = async (response) => {
  const activities = await productModel.getActivity();
  const data = response.map((product) => {
    const matchedAcitvity = activities.find(
      (activity) => product.activity_id === activity.id
    );
    const discountPrice = Math.ceil(matchedAcitvity.discount * product.price);
    return { ...product, discountPrice: discountPrice };
  });
  return data;
};

const getProductByFavItems = async (req, res, next) => {
  const favItems = req.query.favItems;
  // console.log(favItems);
  const response = await favModel.getProductByFavItems(favItems);
  const data = await getDiscountPrice(response);
  res.json(data);
};

module.exports = {
  getProductByFavItems,
};
