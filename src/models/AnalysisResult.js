import mongoose from "mongoose";

const analysisResultSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: [true, "Document is required"],
    },
    analysisType: {
      type: String,
      enum: ["financial", "summary", "custom"],
      default: "summary",
    },
    result: {
      type: String,
      required: [true, "Analysis result is required"],
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

const AnalysisResult = mongoose.model("AnalysisResult", analysisResultSchema);

export default AnalysisResult;
