const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, default: uuidv4 }, // Unique userId
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" } // Default is Member
});

module.exports = mongoose.model("User", UserSchema);
