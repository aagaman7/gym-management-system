const express = require("express");
const { purchaseMembership, getUserMembership, cancelMembership } = require("../controllers/membershipController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure user is authenticated

const router = express.Router();

router.post("/purchase", authMiddleware, purchaseMembership);
router.get("/my-membership", authMiddleware, getUserMembership);
router.delete("/cancel", authMiddleware, cancelMembership);

module.exports = router;
