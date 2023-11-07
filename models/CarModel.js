const mongoose = require("mongoose");
const SeatsModel = require("./SeatsModel");

const CarSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: true,
  },
  driver_name: {
    type: String,
    required: true,
  },
  seats: {
    type: [SeatsModel.schema],
    required: true,
  },
  direction_from: {
    type: String,
    required: true,
  },
  direction_to: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  getDate: {
    type: String,
    default: Date.now,
  },
  getTime: {
    type: String,
    default: Date.now,
  },
  seat_count: {
    type: Number,
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CarModel", CarSchema);
