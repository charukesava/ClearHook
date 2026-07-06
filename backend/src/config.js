import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  geminiApiKey: process.env.GEMINI_API_KEY,
  allowedOrigins: parseOrigins(
    process.env.ALLOWED_ORIGINS ||
      "http://localhost:5173,http://localhost:5174",
  ),
};

export function validateConfig() {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
}
