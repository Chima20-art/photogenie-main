const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re = /^[a-zA-Z]/;
        return value.match(re);
      },
      message: "name invalid",
    },
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
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email adress",
    },
  },
  phone: {
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
});

const User = mongoose.model("User", userSchema);
module.exports = User;
