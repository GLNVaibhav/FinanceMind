import express from "express";
import FinancialData from "../models/FinancialData.js";
import { authenticate } from "../middleware/auth.js";

const financialRoutes = express.Router();

// Create financial data entry
financialRoutes.post("/", authenticate, async (req, res) => {
  try {
    const { company, period, revenue, expenses, profit, cashFlow, assets, liabilities, equity, metrics } = req.body;

    // Create new financial data entry
    const financialData = new FinancialData({
      company,
      period,
      revenue,
      expenses,
      profit,
      cashFlow,
      assets,
      liabilities,
      equity,
      metrics,
      createdBy: req.user.id,
    });

    await financialData.save();

    // Emit socket event for real-time updates
    req.app.get("io")?.to(`financial:${company}`).emit("financial:update", {
      action: "create",
      data: financialData,
    });

    res.status(201).json({
      message: "Financial data created successfully",
      financialData,
    });
  } catch (error) {
    console.error("Create financial data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get financial data
financialRoutes.get("/", authenticate, async (req, res) => {
  try {
    const filter = {};

    // Filter by company
    if (req.query.company) {
      filter.company = req.query.company;
    }

    // Filter by year
    if (req.query.year) {
      filter["period.year"] = Number.parseInt(req.query.year);
    }

    // Filter by month
    if (req.query.month) {
      filter["period.month"] = Number.parseInt(req.query.month);
    }

    // Filter by quarter
    if (req.query.quarter) {
      filter["period.quarter"] = Number.parseInt(req.query.quarter);
    }

    const financialData = await FinancialData.find(filter)
      .populate("company", "name industry")
      .populate("createdBy", "name email")
      .sort({ "period.year": -1, "period.month": -1 });

    res.status(200).json(financialData);
  } catch (error) {
    console.error("Get financial data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get financial data by ID
financialRoutes.get("/:id", authenticate, async (req, res) => {
  try {
    const financialData = await FinancialData.findById(req.params.id)
      .populate("company", "name industry")
      .populate("createdBy", "name email");

    if (!financialData) {
      return res.status(404).json({ message: "Financial data not found" });
    }

    res.status(200).json(financialData);
  } catch (error) {
    console.error("Get financial data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update financial data
financialRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    const { revenue, expenses, profit, cashFlow, assets, liabilities, equity, metrics } = req.body;

    // Find financial data
    const financialData = await FinancialData.findById(req.params.id);
    if (!financialData) {
      return res.status(404).json({ message: "Financial data not found" });
    }

    // Update fields
    if (revenue !== undefined) financialData.revenue = revenue;
    if (expenses !== undefined) financialData.expenses = expenses;
    if (profit !== undefined) financialData.profit = profit;
    if (cashFlow !== undefined) financialData.cashFlow = cashFlow;
    if (assets !== undefined) financialData.assets = assets;
    if (liabilities !== undefined) financialData.liabilities = liabilities;
    if (equity !== undefined) financialData.equity = equity;
    if (metrics !== undefined) financialData.metrics = metrics;

    await financialData.save();

    // Emit socket event for real-time updates
    req.app.get("io")?.to(`financial:${financialData.company}`).emit("financial:update", {
      action: "update",
      data: financialData,
    });

    res.status(200).json({
      message: "Financial data updated successfully",
      financialData,
    });
  } catch (error) {
    console.error("Update financial data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete financial data
financialRoutes.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find financial data
    const financialData = await FinancialData.findById(req.params.id);
    if (!financialData) {
      return res.status(404).json({ message: "Financial data not found" });
    }

    const companyId = financialData.company;

    // Delete financial data
    await FinancialData.findByIdAndDelete(req.params.id);

    // Emit socket event for real-time updates
    req.app.get("io")?.to(`financial:${companyId}`).emit("financial:update", {
      action: "delete",
      id: req.params.id,
    });

    res.status(200).json({ message: "Financial data deleted successfully" });
  } catch (error) {
    console.error("Delete financial data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get financial summary for a company
financialRoutes.get("/summary/:companyId", authenticate, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { year } = req.query;

    const filter = { company: companyId };

    if (year) {
      filter["period.year"] = Number.parseInt(year);
    }

    // Get all financial data for the company
    const financialData = await FinancialData.find(filter);

    // Calculate summary
    const summary = {
      totalRevenue: financialData.reduce((sum, data) => sum + (data.revenue || 0), 0),
      totalExpenses: financialData.reduce((sum, data) => sum + (data.expenses || 0), 0),
      totalProfit: financialData.reduce((sum, data) => sum + (data.profit || 0), 0),
      averageRevenue: 0,
      averageProfit: 0,
      revenueGrowth: 0,
      profitMargin: 0,
      dataPoints: financialData.length,
    };

    // Calculate averages
    if (summary.dataPoints > 0) {
      summary.averageRevenue = summary.totalRevenue / summary.dataPoints;
      summary.averageProfit = summary.totalProfit / summary.dataPoints;

      // Calculate profit margin
      summary.profitMargin = summary.totalRevenue > 0 ? (summary.totalProfit / summary.totalRevenue) * 100 : 0;
    }

    // Calculate growth if we have data from multiple periods
    if (summary.dataPoints > 1) {
      // Sort by period
      const sortedData = [...financialData].sort((a, b) => {
        if (a.period.year !== b.period.year) {
          return a.period.year - b.period.year;
        }
        return (a.period.month || 0) - (b.period.month || 0);
      });

      const firstPeriodRevenue = sortedData[0].revenue || 0;
      const lastPeriodRevenue = sortedData[sortedData.length - 1].revenue || 0;

      if (firstPeriodRevenue > 0) {
        summary.revenueGrowth = ((lastPeriodRevenue - firstPeriodRevenue) / firstPeriodRevenue) * 100;
      }
    }

    res.status(200).json(summary);
  } catch (error) {
    console.error("Get financial summary error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default financialRoutes;
