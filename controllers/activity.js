//處理商業行為
const activityModel = require('../models/activity');

const getActivity = async (req, res, next) => {
  const data = await activityModel.getActivity();
  res.json(data);
};

module.exports = {
  getActivity,
};
