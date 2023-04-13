const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require('jsonwebtoken')
require("dotenv").config();


const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  lastname: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re = /^[a-zA-Z]+$/;
        return value.match(re);
      },
      message: "Name invalid",
    },
  },
  username: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re = /^[a-z0-9]{5,15}$/;
        return value.match(re);
      },
      message: "username invalid",
    },
  },
  birthday: {
    required: true,
    type: String,
  },
  country: {
    type: String,
  },
  email: {
    required: true,
    type: String,
    trim: true,
  },
  number: {
    trim: true,
    type: String,
    validate: {
      validator: (value) => {
        const re =
          /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        return value.match(re);
      },
      message: "Please enter a valid phone number",
    },
  },
  password: {
    required: true,
    trim: true,
    type: String,
    validate: {
      validator: (value) => {
        return value.length > 7;
      },
      message: "Your password is so short",
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(user);
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign({
      _id: this._id,
      number: this.number
  }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  return token
}

const User = mongoose.model("User", userSchema);
module.exports = {User,validate};
