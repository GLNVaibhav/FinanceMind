import express from "express";
import Employee from "../models/Employee.js";
import { authenticate } from "../middleware/auth.js";

const employeeRoutes = express.Router();

// Create a new employee
employeeRoutes.post("/", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, position, department, hireDate, salary, company } = req.body;

    // Create new employee
    const employee = new Employee({
      firstName,
      lastName,
      email,
      position,
      department,
      hireDate,
      salary,
      company,
      createdBy: req.user.id,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all employees
employeeRoutes.get("/", authenticate, async (req, res) => {
  try {
    // Filter by company if provided
    const filter = {};
    if (req.query.company) {
      filter.company = req.query.company;
    }

    const employees = await Employee.find(filter);
    res.status(200).json(employees);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get employee by ID
employeeRoutes.get("/:id", authenticate, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Get employee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update employee
employeeRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, position, department, hireDate, salary } = req.body;

    // Find employee
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee fields
    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (email) employee.email = email;
    if (position) employee.position = position;
    if (department) employee.department = department;
    if (hireDate) employee.hireDate = hireDate;
    if (salary) employee.salary = salary;

    await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete employee
employeeRoutes.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find and delete employee
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default employeeRoutes;
