const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

const Service = mongoose.model("service", serviceSchema);

module.exports = Service;
