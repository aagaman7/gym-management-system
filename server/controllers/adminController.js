// controllers/adminController.js
const User = require("../models/UserModel");
const Booking = require("../models/BookingModel");
const Membership = require("../models/MembershipModel");
const CustomPackage = require("../models/CustomPackageModel");
const Service = require("../models/ServiceModel");
const Trainer = require("../models/TrainerModel");

// User Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('currentMembership');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select('-password')
      .populate({
        path: 'currentMembership',
        populate: { path: 'customPackageId' }
      })
      .populate({
        path: 'membershipHistory',
        populate: { path: 'customPackageId' }
      });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
};

// Dashboard Insights
const getDashboardInsights = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "Admin" });
    const memberCount = await User.countDocuments({ role: "Member" });
    
    // Get active memberships count
    const activeMemberships = await Booking.countDocuments({ 
      isActive: true,
      endDate: { $gte: new Date() }
    });
    
    // Get membership distribution
    const membershipDistribution = await Booking.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$packageType", count: { $sum: 1 } } }
    ]);
    
    // Get revenue stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await Booking.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: "paid"
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // Format revenue data
    const revenueData = revenueByMonth.map(item => ({
      month: `${item._id.year}-${item._id.month}`,
      revenue: item.revenue,
      bookings: item.count
    }));
    
    // Get latest bookings
    const latestBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('customPackageId');
    
    // Get cancellation stats
    const cancelledBookings = await Booking.countDocuments({ isActive: false });
    const pendingCancellations = await Booking.countDocuments({ 
      isActive: true,
      'metadata.cancellationRequested': true
    });
    
    res.json({
      userStats: {
        total: totalUsers,
        admins: adminCount,
        members: memberCount
      },
      membershipStats: {
        active: activeMemberships,
        distribution: membershipDistribution,
        cancelled: cancelledBookings,
        pendingCancellations
      },
      revenueData,
      latestBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard insights", error: error.message });
  }
};

// Services Management
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    
    const newService = new Service({
      name,
      description,
      category,
      price
    });
    
    await newService.save();
    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};

// Trainer Management
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trainers", error: error.message });
  }
};

const getTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findById(id);
    
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trainer", error: error.message });
  }
};

const createTrainer = async (req, res) => {
  try {
    const { 
      name, 
      specialization, 
      image, 
      experience, 
      price, 
      bio, 
      description, 
      qualifications, 
      availability 
    } = req.body;
    
    const newTrainer = new Trainer({
      name,
      specialization,
      image: image || "/api/placeholder/300/300",
      experience,
      price,
      bio,
      description,
      qualifications,
      availability: availability || []
    });
    
    await newTrainer.save();
    res.status(201).json({ message: "Trainer created successfully", trainer: newTrainer });
  } catch (error) {
    res.status(500).json({ message: "Error creating trainer", error: error.message });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const trainer = await Trainer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    
    res.json({ message: "Trainer updated successfully", trainer });
  } catch (error) {
    res.status(500).json({ message: "Error updating trainer", error: error.message });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const trainer = await Trainer.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    
    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trainer", error: error.message });
  }
};

// Booking Management
const handleCancellationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if (approved) {
      // Approve cancellation
      booking.isActive = false;
      
      // If this was the user's current membership, remove it
      const user = await User.findById(booking.userId);
      if (user.currentMembership && user.currentMembership.toString() === booking._id.toString()) {
        user.currentMembership = null;
        await user.save();
      }
      
      // Remove cancellation request flag
      if (booking.metadata) {
        booking.metadata.cancellationRequested = false;
        booking.metadata.cancellationApprovedBy = req.user.id;
        booking.metadata.cancellationApprovedAt = new Date();
      } else {
        booking.metadata = {
          cancellationRequested: false,
          cancellationApprovedBy: req.user.id,
          cancellationApprovedAt: new Date()
        };
      }
      
      await booking.save();
      
      res.json({ message: "Cancellation approved successfully" });
    } else {
      // Reject cancellation
      if (booking.metadata) {
        booking.metadata.cancellationRequested = false;
        booking.metadata.cancellationRejectedBy = req.user.id;
        booking.metadata.cancellationRejectedAt = new Date();
      } else {
        booking.metadata = {
          cancellationRequested: false,
          cancellationRejectedBy: req.user.id,
          cancellationRejectedAt: new Date()
        };
      }
      
      await booking.save();
      
      res.json({ message: "Cancellation rejected" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error handling cancellation request", error: error.message });
  }
};

// Get pending cancellation requests
const getPendingCancellations = async (req, res) => {
  try {
    const pendingCancellations = await Booking.find({
      isActive: true,
      'metadata.cancellationRequested': true
    })
    .populate('userId', 'name email')
    .populate('customPackageId')
    .sort({ createdAt: -1 });
    
    res.json(pendingCancellations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending cancellations", error: error.message });
  }
};

module.exports = {
  // User Management
  getAllUsers,
  getUserDetails,
  updateUserRole,
  
  // Dashboard Insights
  getDashboardInsights,
  
  // Services Management
  getAllServices,
  createService,
  updateService,
  deleteService,
  
  // Trainer Management
  getAllTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  
  // Booking Management
  handleCancellationRequest,
  getPendingCancellations
};