const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, enum: ["Gym", "Cardio", "Sauna", "Pilates", "Pool", "Locker"], required: true },
  pricePerMonth: { type: Number, required: true }
});

module.exports = mongoose.model("Service", serviceSchema);
