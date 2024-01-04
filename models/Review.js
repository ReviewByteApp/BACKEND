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
  like: {
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
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current timestamp
  },
  updatedAt: {
    type: Date,
    default: null, // Set the default value to null for the initial creation
  },
});

// Middleware to update `updatedAt` whenever a document is updated
reviewSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
