// controllers/bookingController.js
const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const CustomPackage = require("../models/CustomPackageModel");
const Membership = require("../models/MembershipModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

// Create a payment intent with Stripe
// Create a payment intent with Stripe
const createPaymentIntent = async (req, res) => {
  try {
    const { packageType, customPackageId, preferredTime, paymentOption, amount } = req.body;
    const userId = req.user.id;
    
    // Validate amount based on membership type and payment option
    let validAmount = amount;
    
    if (packageType !== 'custom') {
      // Fetch the standard membership to verify price
      const membership = await Membership.findOne({ type: packageType });
      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }
      
      // Get the correct price based on payment option
      const priceKey = paymentOption === '1month' ? 'monthly' : 
                      paymentOption === '3month' ? 'quarterly' : 'annual';
                      
      validAmount = membership.price[priceKey];
    } else if (customPackageId) {
      // For custom packages, verify the price
      const customPackage = await CustomPackage.findById(customPackageId);
      if (!customPackage || customPackage.userId.toString() !== userId) {
        return res.status(404).json({ message: "Custom package not found" });
      }
      
      // Apply discounts based on payment option
      if (paymentOption === '3month') {
        validAmount = customPackage.totalPrice * 2.7; // 10% discount on 3 months
      } else if (paymentOption === '1year') {
        validAmount = customPackage.totalPrice * 10.2; // 15% discount on annual
      } else {
        validAmount = customPackage.totalPrice;
      }
    }
    
    // Convert amount to cents for Stripe
    const amountInCents = Math.round(validAmount * 100);
    
    // Check if user already has a Stripe customer ID, or create one
    let user = await User.findById(userId);
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name
      });
      
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: stripeCustomerId,
      metadata: {
        userId: userId,
        packageType: packageType,
        paymentOption: paymentOption,
        customPackageId: customPackageId || ''
      }
    });
    
    // Return the client secret to the frontend
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment intent", error: error.message });
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
      
      // If a refund is needed, handle it through Stripe
      // This is a simplified version - in production, you'd need more complex refund logic
      if (booking.paymentStatus === 'paid' && booking.paymentIntentId) {
        // Calculate refund amount based on time used
        // For this example, we'll just refund the full amount
        try {
          const refund = await stripe.refunds.create({
            payment_intent: booking.paymentIntentId,
            reason: 'requested_by_customer'
          });
          
          booking.paymentStatus = 'refunded';
          await booking.save();
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          return res.status(500).json({ message: "Error processing refund", error: stripeError.message });
        }
      }
      
      res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
  };
  
  // Webhook handler for Stripe events
  const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // You can use this to automatically create a booking when payment succeeds
        // But for security, it's better to create the booking after frontend confirmation
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`Payment failed: ${failedPayment.id}`);
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
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
