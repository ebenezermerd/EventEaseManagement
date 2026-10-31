// config/config.js
// Central runtime configuration. Every secret comes from the environment;
// nothing sensitive has a hardcoded fallback.
require("dotenv").config({ path: [".env.local", ".env"], quiet: true })

const NODE_ENV = process.env.NODE_ENV || "development"
const IS_PRODUCTION = NODE_ENV === "production" || process.env.VERCEL_ENV === "production"

const DATABASE_URL =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED || ""

function readJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.VERCEL) {
    // Refuse to sign tokens with a weak or missing secret on any deployment.
    throw new Error("JWT_SECRET is missing or shorter than 32 characters")
  }
  // Local development only: a per process secret means tokens die on restart.
  if (!global.__eventeaseDevJwtSecret) {
    global.__eventeaseDevJwtSecret = require("crypto").randomBytes(48).toString("base64")
    console.warn("[config] JWT_SECRET not set, using an ephemeral development secret")
  }
  return global.__eventeaseDevJwtSecret
}

const JWT_SECRET = readJwtSecret()
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// Comma separated list of browser origins allowed to call the API.
const CORS_ORIGINS = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || ""
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
const API_BASE_URL =
  process.env.API_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4000")

// Email is optional: without SMTP settings messages are only logged.
const EMAIL_HOST = process.env.EMAIL_HOST || ""
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587)
const EMAIL_USER = process.env.EMAIL_USER || ""
const EMAIL_PASS = process.env.EMAIL_PASS || ""
const EMAIL_FROM = process.env.EMAIL_FROM || "EventEase <no-reply@eventease.app>"

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGINS,
  CHAPA_SECRET_KEY,
  FRONTEND_URL,
  API_BASE_URL,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  PORT: Number(process.env.PORT || 4000),
}
