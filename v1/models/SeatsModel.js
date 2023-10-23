const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  seat_id: {
    type: Number,
    required: true,
  },
  reserved: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("SeatModel", SeatSchema);