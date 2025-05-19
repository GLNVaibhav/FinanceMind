import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import companyRoutes from "./src/routes/company.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";
import financialRoutes from "./src/routes/financial.routes.js";

// Import socket handlers
import { setupSocketHandlers } from "./src/sockets/socketHandlers.js";

// Import middleware
import { errorHandler } from "./src/middleware/errorHandler.js";
import { notFound } from "./src/middleware/notFound.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://financemind.vercel.app", // Add your Vercel frontend URL here
  /\.vercel\.app$/, // Allow all vercel.app subdomains
];

// Configure Socket.IO with proper CORS for production
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Enable both for better compatibility
  pingTimeout: 60000, // Increase timeout for better stability
});

// Make io available to routes
app.set("io", io);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Apply middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((pattern) => pattern instanceof RegExp && pattern.test(origin))
      ) {
        return callback(null, true);
      }

      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...allowedOrigins.filter((origin) => typeof origin === "string"), "wss://*.vercel.app"],
        // Add other directives as needed
      },
    },
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 50 : 100, // stricter in production
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/financial", financialRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Apply error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set up socket.io handlers
setupSocketHandlers(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

export { app, server, io };
