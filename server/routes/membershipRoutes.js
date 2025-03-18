// routes/membershipRoutes.js
const express = require("express");
const router = express.Router();
const { getAllMemberships, getMembershipByType, createMembership, updateMembership, deleteMembership } = require("../controllers/membershipController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getAllMemberships);
router.get("/:type", getMembershipByType);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, createMembership);
router.put("/:id", authMiddleware, adminMiddleware, updateMembership);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMembership);

module.exports = router;