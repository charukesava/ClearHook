import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import analyzeRouter from "./routes/analyze.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

if (!config.geminiApiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const app = express();

app.disable("x-powered-by");

const requestLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return config.allowedOrigins.includes(origin);
};

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...config.allowedOrigins],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: config.nodeEnv === "production" ? undefined : false,
    noSniff: true,
    xssFilter: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: false,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(requestLimiter);

// Health check
const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    service: "ClearHook Backend",
    uptime: process.uptime(),
  });
};

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

// Analyze endpoint
app.use("/", analyzeRouter);
app.use("/api", analyzeRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
const PORT = config.port || 3001;
app.listen(PORT, () => {
  console.log(`✅ ClearHook backend running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🎯 AI Engine: Google Gemini (Flash model)`);
});
