const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number, required: true }, // in months
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
});

module.exports = mongoose.model("Membership", membershipSchema);
