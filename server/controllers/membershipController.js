// controllers/membershipController.js
const Membership = require("../models/MembershipModel");

// Get all memberships
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({ isActive: true });
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: "Error fetching memberships", error: error.message });
  }
};

// Get a single membership by type
const getMembershipByType = async (req, res) => {
  try {
    const { type } = req.params;
    const membership = await Membership.findOne({ type, isActive: true });
    
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    
    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error fetching membership", error: error.message });
  }
};

// For admin: Create a new membership
const createMembership = async (req, res) => {
  try {
    const { name, type, price, features } = req.body;
    
    // Check if membership type already exists
    const existingMembership = await Membership.findOne({ type });
    if (existingMembership) {
      return res.status(400).json({ message: "Membership type already exists" });
    }
    
    const newMembership = new Membership({
      name,
      type,
      price,
      features
    });
    
    await newMembership.save();
    res.status(201).json({ message: "Membership created successfully", membership: newMembership });
  } catch (error) {
    res.status(500).json({ message: "Error creating membership", error: error.message });
  }
};

// For admin: Update an existing membership
const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedMembership = await Membership.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    
    res.json({ message: "Membership updated successfully", membership: updatedMembership });
  } catch (error) {
    res.status(500).json({ message: "Error updating membership", error: error.message });
  }
};

// For admin: Delete (deactivate) a membership
const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    
    const membership = await Membership.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    
    res.json({ message: "Membership deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting membership", error: error.message });
  }
};

module.exports = {
  getAllMemberships,
  getMembershipByType,
  createMembership,
  updateMembership,
  deleteMembership
};