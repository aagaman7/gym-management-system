// models/UserModel.js (updated)
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  // New fields
  currentMembership: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  stripeCustomerId: { type: String }, // For Stripe customer management
  membershipHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);