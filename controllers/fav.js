//處理商業行為
const favModel = require('../models/fav');

const getProductByFavItems = async (req, res, next) => {
  const favItems = req.query.favItems;
  // console.log(favItems);
  const data = await favModel.getProductByFavItems(favItems);
  res.json(data);
};

module.exports = {
  getProductByFavItems,
};
