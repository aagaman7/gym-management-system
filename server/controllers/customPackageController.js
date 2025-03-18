// controllers/customPackageController.js
const CustomPackage = require("../models/CustomPackageModel");

// Create a custom package
const createCustomPackage = async (req, res) => {
  try {
    const { services } = req.body;
    const userId = req.user.id;
    
    // Calculate total price
    const totalPrice = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    
    const newCustomPackage = new CustomPackage({
      userId,
      services,
      totalPrice
    });
    
    await newCustomPackage.save();
    res.status(201).json({ 
      message: "Custom package created successfully", 
      customPackage: newCustomPackage 
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating custom package", error: error.message });
  }
};

// Get user's custom packages
const getUserCustomPackages = async (req, res) => {
  try {
    const userId = req.user.id;
    const customPackages = await CustomPackage.find({ userId, isActive: true });
    
    res.json(customPackages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching custom packages", error: error.message });
  }
};

// Get a single custom package
const getCustomPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const customPackage = await CustomPackage.findById(id);
    
    if (!customPackage) {
      return res.status(404).json({ message: "Custom package not found" });
    }
    
    // Check if the package belongs to the requesting user or user is admin
    if (customPackage.userId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to view this package" });
    }
    
    res.json(customPackage);
  } catch (error) {
    res.status(500).json({ message: "Error fetching custom package", error: error.message });
  }
};

// Update a custom package
const updateCustomPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { services } = req.body;
    
    const customPackage = await CustomPackage.findById(id);
    
    if (!customPackage) {
      return res.status(404).json({ message: "Custom package not found" });
    }
    
    // Check if the package belongs to the requesting user
    if (customPackage.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this package" });
    }
    
    // Calculate new total price
    const totalPrice = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    
    customPackage.services = services;
    customPackage.totalPrice = totalPrice;
    
    await customPackage.save();
    
    res.json({ message: "Custom package updated successfully", customPackage });
  } catch (error) {
    res.status(500).json({ message: "Error updating custom package", error: error.message });
  }
};

// Delete (deactivate) a custom package
const deleteCustomPackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customPackage = await CustomPackage.findById(id);
    
    if (!customPackage) {
      return res.status(404).json({ message: "Custom package not found" });
    }
    
    // Check if the package belongs to the requesting user
    if (customPackage.userId.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this package" });
    }
    
    customPackage.isActive = false;
    await customPackage.save();
    
    res.json({ message: "Custom package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting custom package", error: error.message });
  }
};

module.exports = {
  createCustomPackage,
  getUserCustomPackages,
  getCustomPackage,
  updateCustomPackage,
  deleteCustomPackage
};