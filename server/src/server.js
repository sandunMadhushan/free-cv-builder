import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";

// Import routes
import cvRoutes from "./routes/cvRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Session-Backup"],
  }),
);

app.use(morgan("combined"));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser for session management
app.use(cookieParser());

// Session configuration
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    name: 'cv-builder.sid', // Custom session name
    resave: false,
    saveUninitialized: true, // Create session for unauthenticated requests
    cookie: {
      secure: isProduction, // true in production (HTTPS), false in development (HTTP)
      httpOnly: false, // Allow JavaScript access for popup scenarios
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: isProduction ? 'none' : 'lax', // 'none' for production cross-site, 'lax' for development
      domain: undefined, // Let browser set the domain
      path: '/', // Ensure cookie is available for all paths
    },
    rolling: true, // Reset expiration on each request
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api/", limiter);

// Routes
app.use("/api/cv", cvRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "CV Builder API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      cv: "/api/cv",
      share: "/api/share",
      auth: "/api/auth",
      github: "/api/auth/github",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found on this server.",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate Resource",
      message: "A resource with this information already exists.",
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong on the server.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/cv-builder";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // In development, continue without database
    if (process.env.NODE_ENV !== "production") {
      console.log("⚠️  Continuing without database in development mode");
      return;
    }

    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);

    if (process.env.NODE_ENV !== "production") {
      console.log(`👨‍💻 API docs: http://localhost:${PORT}/`);
    }
  });
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  });
});

startServer().catch(console.error);
