// middleware/errorHandler.js
const { ValidationError, UniqueConstraintError } = require("sequelize")

// Centralised error responses; internal details are hidden in production.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500
  let message = err.message || "Internal server error"

  if (err instanceof UniqueConstraintError) {
    status = 409
    message = err.errors?.map((e) => e.message).join(", ") || "Duplicate value"
  } else if (err instanceof ValidationError) {
    status = 400
    message = err.errors.map((e) => e.message).join(", ")
  } else if (err.type === "entity.parse.failed") {
    status = 400
    message = "Invalid JSON payload"
  }

  if (status >= 500) {
    console.error("[api] unhandled error:", err)
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) message = "Internal server error"
  }

  res.status(status).json({ success: false, message })
}

module.exports = errorHandler
