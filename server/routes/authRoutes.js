const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController"); // Import controller functions
const authenticateToken = require("../middleware/authMiddleware"); // Middleware for token verification
const router = express.Router();

// **Register Route**
router.post("/register", registerUser);

// **Login Route**
router.post("/login", loginUser);

// **Protected Route (Example Profile)**
router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
