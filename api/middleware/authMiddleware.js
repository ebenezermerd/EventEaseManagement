// middleware/authMiddleware.js
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/config")
const User = require("../models/user")
const Organizer = require("../models/organizer")

function readToken(req) {
  const header = req.headers.authorization || ""
  if (header.startsWith("Bearer ")) return header.slice(7).trim()
  return null
}

// Attach req.user when a valid token is present, but never reject the request.
const optionalAuth = async (req, res, next) => {
  const token = readToken(req)
  req.user = null
  if (!token) return next()
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = { id: decoded.id, role: decoded.role }
  } catch (_) {
    req.user = null
  }
  next()
}

// Require a valid token for an existing, active user.
const userAuth = async (req, res, next) => {
  const token = readToken(req)
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" })
  }
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (_) {
    return res.status(401).json({ success: false, message: "Your session has expired, please sign in again" })
  }
  try {
    const user = await User.findByPk(decoded.id, { attributes: ["id", "name", "email", "role", "status"] })
    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Account not found or inactive" })
    }
    req.user = { id: user.id, role: user.role, name: user.name, email: user.email }
    next()
  } catch (error) {
    next(error)
  }
}

// checkRole("admin"), checkRole("organizer"), checkRole(["admin", "organizer"]).
// "user" means any signed in account. Admins pass every organizer check.
const checkRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles]
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" })
    }
    if (allowed.includes("user") || allowed.includes(req.user.role)) {
      if (req.user.role === "organizer" && allowed.includes("organizer")) {
        const organizer = await Organizer.findOne({ where: { userId: req.user.id } })
        if (!organizer) {
          return res.status(403).json({ success: false, message: "Organizer profile not found" })
        }
        req.organizer = organizer
      }
      return next()
    }
    if (req.user.role === "admin" && allowed.includes("organizer")) return next()
    return res.status(403).json({ success: false, message: "You do not have access to this resource" })
  }
}

// Only organizers an admin has approved may publish or change events.
const requireApprovedOrganizer = async (req, res, next) => {
  if (req.user?.role === "admin") return next()
  const organizer = req.organizer || (await Organizer.findOne({ where: { userId: req.user.id } }))
  if (!organizer) {
    return res.status(403).json({ success: false, message: "Organizer profile not found" })
  }
  if (organizer.approvalStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Your organizer account is waiting for admin approval",
      approvalStatus: organizer.approvalStatus,
    })
  }
  req.organizer = organizer
  next()
}

module.exports = { userAuth, checkRole, optionalAuth, requireApprovedOrganizer }
