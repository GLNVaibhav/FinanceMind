import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const userRoutes = express.Router();

// Get current user
userRoutes.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users (admin only)
userRoutes.get("/", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user
userRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if user is updating their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Only admin can update role
    if (role && req.user.role === "admin") {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user (admin only)
userRoutes.delete("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find and delete user
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default userRoutes;
