/* 用來把query string的字串轉為數字陣列 */
const toNumber = (string) => {
  return string.split(',').map((item) => Number(item));
};

// 用來產生prepared statement WHERE IN ()需要的?問號
const handlePrepare = (string) => {
  return string
    .split(',')
    .map(() => '?')
    .join(',');
};

module.exports = { toNumber, handlePrepare };
