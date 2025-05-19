export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large",
        error: `File size should be less than ${process.env.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      });
    }
    return res.status(400).json({ message: err.message });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: "Duplicate field value",
      error: `${field} already exists`,
    });
  }

  // Default error handler
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? "An error occurred" : err.stack,
  });
};
