// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/roleMiddleware");

// Apply middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard Insights
router.get("/dashboard/insights", adminController.getDashboardInsights);

// User Management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserDetails);
router.patch("/users/:id/role", adminController.updateUserRole);

// Services Management
router.get("/services", adminController.getAllServices);
router.post("/services", adminController.createService);
router.put("/services/:id", adminController.updateService);
router.delete("/services/:id", adminController.deleteService);

// Trainer Management
router.get("/trainers", adminController.getAllTrainers);
router.get("/trainers/:id", adminController.getTrainer);
router.post("/trainers", adminController.createTrainer);
router.put("/trainers/:id", adminController.updateTrainer);
router.delete("/trainers/:id", adminController.deleteTrainer);

// Booking Management
router.get("/bookings/pending-cancellations", adminController.getPendingCancellations);
router.patch("/bookings/:id/cancellation", adminController.handleCancellationRequest);

module.exports = router;