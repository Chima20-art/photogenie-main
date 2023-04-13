const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userNumberSchema = Schema({
    number: {
        type: String,
        required: true
    }
}, { timestamps: true });

userNumberSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token
}

module.exports.UserNumber = model('User', userNumberSchema);