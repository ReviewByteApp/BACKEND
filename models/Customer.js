const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
});

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
