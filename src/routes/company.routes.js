import express from "express";
import Company from "../models/Company.js";
import { authenticate } from "../middleware/auth.js";

const companyRoutes = express.Router();

// Create a new company
companyRoutes.post("/", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, industry, address, contactEmail, contactPhone } = req.body;

    // Create new company
    const company = new Company({
      name,
      industry,
      address,
      contactEmail,
      contactPhone,
      createdBy: req.user.id,
    });

    await company.save();

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all companies
companyRoutes.get("/", authenticate, async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get company by ID
companyRoutes.get("/:id", authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update company
companyRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, industry, address, contactEmail, contactPhone } = req.body;

    // Find company
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update company fields
    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (address) company.address = address;
    if (contactEmail) company.contactEmail = contactEmail;
    if (contactPhone) company.contactPhone = contactPhone;

    await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete company
companyRoutes.delete("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find and delete company
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default companyRoutes;
