const mongoose = require("mongoose");
const Joi = require("joi");

const userVerificationSchema = mongoose.Schema({
 userId:String,
 uniqueString: String,
 createdAt: Date,
 expiresAt:Date,
});


const UserVerification = mongoose.model("UserVerification", userVerificationSchema);
module.exports = UserVerification ;