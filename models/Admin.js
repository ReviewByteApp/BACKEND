const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: {
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
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  map: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
  },
  profilePicture: {
    type: String,
    required: false,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  video: {
    type: String,
    required: false,
  },
  services: [
    {
      type: String,
      required: true,
    },
  ],
  reviewCount: {
    type: Number,
    required: true,
  },
  reviewScore: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  phone: [
    {
      type: String,
      required: true,
    },
  ],
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
adminSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
