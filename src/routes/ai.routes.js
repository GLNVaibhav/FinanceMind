import express from "express";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import Document from "../models/Document.js";
import AnalysisResult from "../models/AnalysisResult.js";
import { authenticate } from "../middleware/auth.js";
import { fileURLToPath } from "url";

// Get current file directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aiRoutes = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze document
aiRoutes.post("/analyze-document/:documentId", authenticate, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { analysisType, questions } = req.body;

    // Find document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if file exists
    const filePath = path.resolve(document.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Prepare prompt based on analysis type
    let prompt = "";

    if (analysisType === "financial") {
      prompt = `Analyze the following financial document and provide insights:
      
      ${fileContent.substring(0, 15000)}
      
      Please provide:
      1. Key financial metrics
      2. Trends and patterns
      3. Areas of concern
      4. Recommendations`;
    } else if (analysisType === "custom" && questions) {
      prompt = `Analyze the following document and answer these questions:
      
      ${fileContent.substring(0, 15000)}
      
      Questions:
      ${questions.join("\n")}`;
    } else {
      prompt = `Analyze the following document and provide a summary:
      
      ${fileContent.substring(0, 15000)}`;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial analysis assistant. Provide clear, concise, and accurate analysis.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysisResult = completion.choices[0].message.content;

    // Save analysis result
    const result = new AnalysisResult({
      document: documentId,
      analysisType,
      result: analysisResult,
      createdBy: req.user.id,
    });

    await result.save();

    res.status(200).json({
      message: "Document analyzed successfully",
      analysis: {
        id: result._id,
        result: analysisResult,
        analysisType,
        documentId,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error("Document analysis error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get analysis history
aiRoutes.get("/analysis-history", authenticate, async (req, res) => {
  try {
    const filter = {};

    // Filter by document if provided
    if (req.query.document) {
      filter.document = req.query.document;
    }

    // Filter by user if not admin
    if (req.user.role !== "admin") {
      filter.createdBy = req.user.id;
    }

    const analysisResults = await AnalysisResult.find(filter)
      .populate("document", "title fileName")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(analysisResults);
  } catch (error) {
    console.error("Get analysis history error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get analysis by ID
aiRoutes.get("/analysis/:id", authenticate, async (req, res) => {
  try {
    const analysisResult = await AnalysisResult.findById(req.params.id)
      .populate("document", "title fileName")
      .populate("createdBy", "name email");

    if (!analysisResult) {
      return res.status(404).json({ message: "Analysis result not found" });
    }

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Chat with AI about financial data
aiRoutes.post("/chat", authenticate, async (req, res) => {
  try {
    const { message, context } = req.body;

    // Prepare system message based on context
    let systemMessage =
      "You are a financial analysis assistant. Provide clear, concise, and accurate information about financial matters.";

    if (context && context.type === "document" && context.id) {
      // If context is a document, fetch it and include in prompt
      const document = await Document.findById(context.id);
      if (document) {
        const filePath = path.resolve(document.filePath);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf8");
          systemMessage += `\n\nYou have access to the following document: ${document.title}\n\nDocument content (excerpt):\n${fileContent.substring(0, 5000)}`;
        }
      }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({
      message: "Chat response generated",
      response,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default aiRoutes;
