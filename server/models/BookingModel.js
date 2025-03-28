// models/BookingModel.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageType: { type: String, required: true }, // basic, premium, elite, custom
  customPackageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomPackage' }, // Only if packageType is custom
  preferredTime: { type: String, required: true },
  paymentOption: { type: String, required: true }, // 1month, 3month, 1year
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentIntentId: { type: String }, // Reserved for future payment integration
  bookingReference: { type: String, required: true, unique: true }, // GYM-XXXX format
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  // Additional fields for admin-related functionality
  metadata: {
    cancellationRequested: { type: Boolean, default: false },
    cancellationReason: { type: String },
    cancellationRequestedAt: { type: Date },
    cancellationApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancellationApprovedAt: { type: Date },
    cancellationRejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancellationRejectedAt: { type: Date },
    notes: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);