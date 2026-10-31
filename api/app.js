// app.js: builds the Express application without starting a server, so the
// same app runs on Vercel Functions (exported) and locally (index.js listens).
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { CORS_ORIGINS } = require("./config/config")
const sequelize = require("./config/database")
require("./models/association")
const errorHandler = require("./middleware/errorHandler")

const app = express()
app.set("trust proxy", 1)
app.disable("x-powered-by")

// Browsers may call the API from configured origins, localhost, and this
// team's Vercel preview URLs for the web project.
const previewOrigin = /^https:\/\/eventease(-[a-z0-9-]+)?\.vercel\.app$/
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      const ok =
        CORS_ORIGINS.includes(origin) || previewOrigin.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      callback(null, ok)
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
)
app.use(helmet())
app.use(morgan(process.env.VERCEL ? "tiny" : "dev"))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

// Mounts an optional feature. When it is switched off, or its dependencies
// are missing, requests under its own prefix answer 503 instead of crashing
// the whole API at import time.
function mountOptional(app, { name, mountPath, disabledPrefixes, load, enabled = true }) {
  const unavailable = (req, res) =>
    res.status(503).json({ success: false, message: `${name} is not enabled on this deployment` })
  if (enabled) {
    try {
      app.use(mountPath, load())
      return
    } catch (error) {
      console.warn(`[api] ${name} disabled: ${error.message}`)
    }
  }
  for (const prefix of disabledPrefixes) app.use(prefix, unavailable)
}

app.get("/", (req, res) => {
  res.json({ name: "EventEase API", status: "ok", docs: "https://github.com/ebenezermerd/EventEaseManagement#api" })
})

app.get(["/health", "/api/health"], async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({ status: "ok", database: "ok" })
  } catch (error) {
    res.status(503).json({ status: "degraded", database: "unreachable" })
  }
})

// Core product routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/categories", require("./routes/categoryRoutes"))
app.use("/api/locations", require("./routes/locationRoutes"))
app.use("/api/users", require("./routes/userRoute"))
app.use("/api", require("./routes/eventRoutes"))
app.use("/api", require("./routes/ticketRoutes"))
app.use("/api", require("./routes/bookingRoutes"))
app.use("/api", require("./routes/paymentRoutes"))
app.use("/api", require("./routes/organizerRoutes"))
app.use("/api", require("./routes/adminRoute"))
app.use("/api", require("./routes/aiRoutes"))

// Optional modules ported from the original backend. They need external
// services (Google or Microsoft calendars, Firebase or Twilio, S3 or Azure
// storage, spreadsheet exports) that this deployment does not configure.
const extended = process.env.ENABLE_EXTENDED_MODULES === "true"
mountOptional(app, {
  name: "Recommendations",
  mountPath: "/api/users",
  disabledPrefixes: ["/api/users/recommendations"],
  load: () => require("./routes/recommendationRoutes"),
})
mountOptional(app, {
  name: "Order management",
  mountPath: "/api",
  disabledPrefixes: ["/api/organizers/orders"],
  load: () => require("./routes/orderRoutes"),
  enabled: extended,
})
mountOptional(app, {
  name: "Order statistics",
  mountPath: "/api",
  disabledPrefixes: ["/api/orders/statistics"],
  load: () => require("./routes/orderStatisticsRoutes"),
  enabled: extended,
})
mountOptional(app, {
  name: "Calendar sync",
  mountPath: "/api/users",
  disabledPrefixes: ["/api/users/calendars", "/api/users/calendar-events"],
  load: () => require("./routes/calendarRoutes"),
  enabled: extended,
})
mountOptional(app, {
  name: "Push and SMS notifications",
  mountPath: "/api/users",
  disabledPrefixes: ["/api/users/notifications/push-token", "/api/users/notification-settings"],
  load: () => require("./routes/notificationRoutes"),
  enabled: extended,
})
mountOptional(app, {
  name: "File storage",
  mountPath: "/api/storage",
  disabledPrefixes: ["/api/storage"],
  load: () => require("./routes/storageRoutes"),
  enabled: extended,
})

app.use("/api", (req, res) => res.status(404).json({ success: false, message: "Route not found" }))
app.use(errorHandler)

module.exports = app
