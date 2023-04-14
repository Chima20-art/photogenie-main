const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passwordResetSchema = new Schema({
    userId: String,
    resetString: String,
    createdAt: Date,
    expiresAt: Date,
    verified: Boolean,
})

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)
module.exports = PasswordReset
