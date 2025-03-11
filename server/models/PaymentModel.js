const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership", required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }
});

module.exports = mongoose.model("Payment", paymentSchema);
