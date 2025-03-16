const Membership = require("../models/Membership");
const Package = require("../models/Package");

// Purchase Membership
exports.purchaseMembership = async (req, res) => {
  try {
    const { packageId, duration } = req.body; // duration in months (1, 3, 12)
    const userId = req.user.id; // From authentication middleware

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) return res.status(404).json({ message: "Package not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + duration); // Set end date based on duration

    const membership = new Membership({
      user: userId,
      package: packageId,
      startDate,
      endDate,
      status: "Active",
      paymentStatus: "Pending"
    });

    await membership.save();

    res.status(201).json({ message: "Membership purchased successfully", membership });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get User's Membership
exports.getUserMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user.id }).populate("package");
    if (!membership) return res.status(404).json({ message: "No active membership found" });

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Cancel Membership
exports.cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user.id });
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    membership.status = "Cancelled";
    await membership.save();

    res.status(200).json({ message: "Membership cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
