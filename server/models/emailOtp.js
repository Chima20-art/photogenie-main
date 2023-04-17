const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailOtpSchema = new Schema({
    userId: String,
    resetString: String,
    createdAt: Date,
    expiresAt: Date,
    verified: Boolean
});

const EmailOtp = mongoose.model('EmailOtp', emailOtpSchema);
module.exports = EmailOtp;
