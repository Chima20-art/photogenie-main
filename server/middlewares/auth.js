const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization denied." });

    const verified = jwt.verify(token, "passwordKey");

    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    }
    req.user = verified.id;

    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports =auth;

// async function createOtp(params, callback) {
//   const otp = otpGenerator.generate(6, {
//     upperCase: false,
//     specialChars: false,
//     alphabets: false,
//   });
//   const ttl = 1000 * 60 * 1;
//   const expires = Date.now() + ttl;
//   const data = `${params.email}.${otp}.${expires}`;
//   const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
//   const fullHash = `${hash}.${expires}`;
//   console.log(`Your OTP is ${otp}`);
  
//   //send sms
//   return callback(null, fullHash);
// }

// async function verifyOtp(params, callback) {
//   let [hashValue, expires] = params.hash.split(".");
//   let now = Date.now();
//   if (now > parseInt(expires)) {
//     return callback(new Error("OTP expired"));
//   }
  
//   let data = `${params.email}.${params.otp}.${expires}`;
//   let newCalculateHash = crypto
//   .createHmac("256", key)
//   .update(data)
//   .digest("hex");
  
//   if (newCalculateHash === hashValue) {
//     return callback(null, "Success");
//   }
//   return callback("Invalid OTP");
// }

