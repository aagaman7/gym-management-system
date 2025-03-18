// routes/customPackageRoutes.js
const express = require("express");
const router = express.Router();
const { createCustomPackage, getUserCustomPackages, getCustomPackage, updateCustomPackage, deleteCustomPackage } = require("../controllers/customPackageController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// User routes
router.post("/", createCustomPackage);
router.get("/", getUserCustomPackages);
router.get("/:id", getCustomPackage);
router.put("/:id", updateCustomPackage);
router.delete("/:id", deleteCustomPackage);

module.exports = router;