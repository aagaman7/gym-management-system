// controllers/bookingController.js
const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const CustomPackage = require("../models/CustomPackageModel");
const Membership = require("../models/MembershipModel");

// Helper function to generate booking reference
const generateBookingReference = async () => {
  const prefix = "GYM-";
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const reference = `${prefix}${randomNum}`;
  
  // Check if the reference already exists
  const existingBooking = await Booking.findOne({ bookingReference: reference });
  if (existingBooking) {
    // If it exists, generate a new one recursively
    return generateBookingReference();
  }
  
  return reference;
};

// Calculate end date based on payment option
const calculateEndDate = (startDate, paymentOption) => {
  const start = new Date(startDate);
  
  switch (paymentOption) {
    case '1month':
      return new Date(start.setMonth(start.getMonth() + 1));
    case '3month':
      return new Date(start.setMonth(start.getMonth() + 3));
    case '1year':
      return new Date(start.setFullYear(start.getFullYear() + 1));
    default:
      return new Date(start.setMonth(start.getMonth() + 1));
  }
};

// Create a booking (without payment for now)
const createBooking = async (req, res) => {
  try {
    const { packageType, customPackageId, preferredTime, paymentOption, amount, startDate } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!packageType || !preferredTime || !paymentOption) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // If custom package, verify it exists and belongs to user
    if (packageType === 'custom' && customPackageId) {
      const customPackage = await CustomPackage.findById(customPackageId);
      if (!customPackage || customPackage.userId.toString() !== userId) {
        return res.status(404).json({ message: "Custom package not found or not owned by user" });
      }
    } else if (packageType !== 'basic' && packageType !== 'premium' && packageType !== 'elite') {
      return res.status(400).json({ message: "Invalid package type" });
    }
    
    // Calculate amount based on membership type and payment option (for future payment implementation)
    let calculatedAmount = amount;
    if (!calculatedAmount) {
      if (packageType !== 'custom') {
        // Get standard membership pricing
        const membership = await Membership.findOne({ type: packageType });
        if (!membership) {
          return res.status(404).json({ message: "Membership not found" });
        }
        
        // Get price based on payment option
        const priceKey = paymentOption === '1month' ? 'monthly' : 
                        paymentOption === '3month' ? 'quarterly' : 'annual';
        calculatedAmount = membership.price[priceKey];
      } else if (customPackageId) {
        // For custom packages
        const customPackage = await CustomPackage.findById(customPackageId);
        
        // Apply discounts based on payment option
        if (paymentOption === '3month') {
          calculatedAmount = customPackage.totalPrice * 2.7; // 10% discount on 3 months
        } else if (paymentOption === '1year') {
          calculatedAmount = customPackage.totalPrice * 10.2; // 15% discount on annual
        } else {
          calculatedAmount = customPackage.totalPrice;
        }
      }
    }
    
    // Generate booking reference
    const bookingReference = await generateBookingReference();
    
    // Calculate start and end dates
    const bookingStartDate = startDate ? new Date(startDate) : new Date();
    const endDate = calculateEndDate(bookingStartDate, paymentOption);
    
    // Create the booking
    const newBooking = new Booking({
      userId,
      packageType,
      customPackageId: packageType === 'custom' ? customPackageId : null,
      preferredTime,
      paymentOption,
      amount: calculatedAmount,
      paymentStatus: 'pending', // Will be updated when payment gateway is added
      bookingReference,
      startDate: bookingStartDate,
      endDate
    });
    
    await newBooking.save();
    
    // Update user's current membership
    const user = await User.findById(userId);
    user.currentMembership = newBooking._id;
    
    // Add to membership history if not already included
    if (!user.membershipHistory.includes(newBooking._id)) {
      user.membershipHistory.push(newBooking._id);
    }
    
    await user.save();
    
    res.status(201).json({ 
      message: "Booking created successfully", 
      booking: newBooking 
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .populate('customPackageId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// Get a single booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('customPackageId');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Check if the booking belongs to the requesting user or user is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

// Get a single booking by reference
const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ bookingReference: reference }).populate('customPackageId');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Check if the booking belongs to the requesting user or user is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

// For admin: Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('customPackageId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Check if the booking belongs to the requesting user or user is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    
    // Update booking status
    booking.isActive = false;
    await booking.save();
    
    // If this was the user's current membership, remove it
    const user = await User.findById(booking.userId);
    if (user.currentMembership && user.currentMembership.toString() === booking._id.toString()) {
      user.currentMembership = null;
      await user.save();
    }
    
    // Payment refund handling will be added in the future
    
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};

// Placeholder for future payment intent creation (to be implemented with payment gateway)
const createPaymentIntent = async (req, res) => {
  try {
    // This is a placeholder that will be replaced when payment gateway is added
    // For now, just return a success response so the frontend can continue
    res.json({
      message: "Payment functionality will be implemented in the future",
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

// Placeholder for future webhook handling (to be implemented with payment gateway)
const handleStripeWebhook = async (req, res) => {
  // Placeholder for future implementation
  res.status(200).json({ received: true });
};

module.exports = {
  createPaymentIntent,
  createBooking,
  getUserBookings,
  getBooking,
  getBookingByReference,
  getAllBookings,
  cancelBooking,
  handleStripeWebhook
};