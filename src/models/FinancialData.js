import mongoose from "mongoose";

const financialDataSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    period: {
      year: {
        type: Number,
        required: [true, "Year is required"],
      },
      month: Number,
      quarter: Number,
      isAnnual: {
        type: Boolean,
        default: false,
      },
    },
    revenue: {
      type: Number,
      default: 0,
    },
    expenses: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    cashFlow: {
      operating: {
        type: Number,
        default: 0,
      },
      investing: {
        type: Number,
        default: 0,
      },
      financing: {
        type: Number,
        default: 0,
      },
      net: {
        type: Number,
        default: 0,
      },
    },
    assets: {
      current: {
        type: Number,
        default: 0,
      },
      nonCurrent: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    liabilities: {
      current: {
        type: Number,
        default: 0,
      },
      nonCurrent: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    equity: {
      type: Number,
      default: 0,
    },
    metrics: {
      profitMargin: Number,
      returnOnAssets: Number,
      returnOnEquity: Number,
      debtToEquity: Number,
      currentRatio: Number,
      quickRatio: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

const FinancialData = mongoose.model("FinancialData", financialDataSchema);

export default FinancialData;
