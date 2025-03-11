const mongoose = require("mongoose");

const userBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "GymSchedule", required: true },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership", required: true },
  bookingStatus: { type: String, enum: ["Confirmed", "Pending", "Cancelled"], default: "Pending" }
});

module.exports = mongoose.model("UserBooking", userBookingSchema);
