const mongoose = require("mongoose");

const gymScheduleSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // Example: "08:00"
  endTime: { type: String, required: true },
  maxCapacity: { type: Number, default: 150 },
  currentBookings: { type: Number, default: 0 }
});

module.exports = mongoose.model("GymSchedule", gymScheduleSchema);
