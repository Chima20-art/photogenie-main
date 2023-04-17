
const jwt = require('jsonwebtoken');

function verifyRefresh(email, refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, 'refreshSecret');
    if (decoded.email === email) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
module.exports = {
  verifyRefresh,generateRandomNumber
};


