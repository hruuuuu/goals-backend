// 處理商業行為
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

const getProducts = async (req, res, next) => {
  // 關鍵字搜尋
  const search = req.query.search;
  // 價錢範圍
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  // 類別
  const category = req.query.category;
  // 活動
  const activity = req.query.activity;
  // 排序
  const sortBy = req.query.sortBy;

  if (req.query.search) {
    // filter submit有search
    const response = await productModel.getProductsBySearch(
      search,
      category,
      activity
    );
    const dataWithDiscount = await getDiscountPrice(response);
    const data = dataWithDiscount.filter(
      (product) =>
        product.discountPrice >= minPrice && product.discountPrice <= maxPrice
    );
    res.json(data);
  } else if (!req.query.search && req.query.category) {
    // filter submit沒有search -> 條件最大化
    const response = await productModel.getProductsByFilter(category, activity);
    const dataWithDiscount = await getDiscountPrice(response);
    const data = dataWithDiscount.filter(
      (product) =>
        product.discountPrice >= minPrice && product.discountPrice <= maxPrice
    );
    res.json(data);
  } else if (req.query.sortBy) {
    let column = '';
    let method = '';
    const response = await productModel.getProducts();
    const dataWithDiscount = await getDiscountPrice(response);
    const handleSort = async () => {
      switch (sortBy) {
        case 'priceDesc':
          return dataWithDiscount.sort(
            (a, b) => b.discountPrice - a.discountPrice
          );
        case 'priceAsc':
          return dataWithDiscount.sort(
            (a, b) => a.discountPrice - b.discountPrice
          );
        case 'caloriesDesc':
          column = 'calories';
          method = 'DESC';
          const descData = await productModel.getProductsBySort(column, method);
          return await getDiscountPrice(descData);
        case 'caloriesAsc':
          column = 'calories';
          method = 'ASC';
          const ascData = await productModel.getProductsBySort(column, method);
          return await getDiscountPrice(ascData);
      }
    };
    const data = await handleSort();
    res.json(data);
  } else {
    const response = await productModel.getProducts();
    const data = await getDiscountPrice(response);
    res.json(data);
  }
};

const getCategory = async (req, res, next) => {
  const data = await productModel.getCategory();
  res.json(data);
};

const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  const response = await productModel.getProductById(productId);
  const data = await getDiscountPrice(response);
  res.json(data);
};

module.exports = {
  getDiscountPrice,
  getProducts,
  getCategory,
  getProductById,
};
