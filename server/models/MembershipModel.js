// models/MembershipModel.js
const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Basic, Premium, Elite, Custom
  type: { type: String, required: true }, // basic, premium, elite, custom
  price: {
    monthly: { type: Number, required: true },
    quarterly: { type: Number, required: true },
    annual: { type: Number, required: true }
  },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Membership", MembershipSchema);