import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Document from "../models/Document.js";
import { authenticate } from "../middleware/auth.js";
import { fileURLToPath } from "url";

// Get current file directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, Word, Excel, CSV, and text files are allowed."));
    }
  },
});

const documentRoutes = express.Router();

// Upload a new document
documentRoutes.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, category, company } = req.body;

    // Create new document
    const document = new Document({
      title: title || req.file.originalname,
      description,
      category,
      company,
      filePath: req.file.path,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    await document.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all documents
documentRoutes.get("/", authenticate, async (req, res) => {
  try {
    // Filter by company if provided
    const filter = {};
    if (req.query.company) {
      filter.company = req.query.company;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const documents = await Document.find(filter).populate("uploadedBy", "name email").sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get document by ID
documentRoutes.get("/:id", authenticate, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate("uploadedBy", "name email");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Download document
documentRoutes.get("/:id/download", authenticate, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve(document.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, document.title + path.extname(document.fileName));
  } catch (error) {
    console.error("Download document error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update document metadata
documentRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Find document
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Update document fields
    if (title) document.title = title;
    if (description) document.description = description;
    if (category) document.category = category;

    await document.save();

    res.status(200).json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete document
documentRoutes.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find document
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Delete file from storage
    const filePath = path.resolve(document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document from database
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default documentRoutes;
