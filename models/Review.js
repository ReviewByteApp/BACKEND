const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  usefulCount: {
    type: Number,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
