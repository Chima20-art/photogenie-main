
const jwt = require('jsonwebtoken');

function verifyRefresh(email, refreshToken) {
console.log("email",email);
console.log("refreshToken verifyRefresh",refreshToken)
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

module.exports = {
  verifyRefresh,
};

