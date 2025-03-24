
// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { 
  createPaymentIntent, 
  createBooking, 
  getUserBookings, 
  getBooking, 
  getBookingByReference, 
  getAllBookings, 
  cancelBooking,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/roleMiddleware");

// Placeholder for future payment webhook
// router.post("/webhook", handleStripeWebhook);

// Payment intent placeholder (for future implementation)
router.post("/payment-intent", authMiddleware, createPaymentIntent);

// Booking routes
router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBookings);
router.get("/:id", authMiddleware, getBooking);
router.get("/reference/:reference", authMiddleware, getBookingByReference);
router.delete("/:id", authMiddleware, cancelBooking);
// router.post("/:id/request-cancellation", authMiddleware, requestCancellation);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;