// controllers/authController.js
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const User = require("../models/user")
const Organizer = require("../models/organizer")
const { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } = require("../config/config")
const sendEmail = require("../middleware/sendEmail")

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  status: user.status,
  joinDate: user.joinDate,
})

const publicOrganizer = (organizer) =>
  organizer
    ? {
        companyName: organizer.companyName,
        description: organizer.description,
        website: organizer.website,
        region: organizer.region,
        approvalStatus: organizer.approvalStatus,
        verified: organizer.verified,
      }
    : null

// POST /api/auth/register and /api/auth/organizer/register
// Self registration creates attendees or organizers; admins are never self registered.
exports.register = async (req, res, next) => {
  const wantsOrganizer = req.path.includes("/organizer/") || req.body.role === "organizer"
  if (req.path.includes("/admin/") || req.body.role === "admin") {
    return res.status(403).json({ success: false, message: "Admin accounts cannot be created through registration" })
  }

  const { name, password, phone, companyName, description, website, address, region, tinNumber } = req.body
  const email = String(req.body.email).trim().toLowerCase()

  try {
    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" })
    }
    if (wantsOrganizer) {
      if (!companyName || !tinNumber) {
        return res.status(400).json({ success: false, message: "Organizer registration requires companyName and tinNumber" })
      }
      const tinTaken = await Organizer.findOne({ where: { tinNumber } })
      if (tinTaken) {
        return res.status(409).json({ success: false, message: "This TIN number is already registered" })
      }
    }

    const result = await sequelize.transaction(async (transaction) => {
      const user = await User.create(
        {
          name,
          email,
          password: await bcrypt.hash(password, 10),
          phone: phone || null,
          role: wantsOrganizer ? "organizer" : "attendee",
          status: "active",
          joinDate: new Date(),
        },
        { transaction },
      )
      let organizer = null
      if (wantsOrganizer) {
        organizer = await Organizer.create(
          {
            userId: user.id,
            companyName,
            description: description || null,
            website: website || null,
            address: address || null,
            region: region || null,
            tinNumber,
            approvalStatus: "pending",
          },
          { transaction },
        )
      }
      return { user, organizer }
    })

    res.status(201).json({
      success: true,
      message: wantsOrganizer
        ? "Organizer account created. An admin will review it before you can publish events."
        : "Account created",
      user: publicUser(result.user),
      organizer: publicOrganizer(result.organizer),
      token: signToken(result.user),
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login (role specific aliases share this handler)
exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email).trim().toLowerCase()
    const user = await User.findOne({ where: { email } })
    const valid = user ? await bcrypt.compare(req.body.password, user.password) : false
    if (!user || !valid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }
    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "This account is not active" })
    }
    await user.update({ lastLogin: new Date() })
    const organizer = user.role === "organizer" ? await Organizer.findOne({ where: { userId: user.id } }) : null

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: publicUser(user),
      organizer: publicOrganizer(organizer),
      token: signToken(user),
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/logout: tokens are stateless, the client discards it.
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out" })
}

// GET /api/auth/me
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    const organizer = user.role === "organizer" ? await Organizer.findOne({ where: { userId: user.id } }) : null
    res.json({ success: true, user: publicUser(user), organizer: publicOrganizer(organizer) })
  } catch (error) {
    next(error)
  }
}

exports.getAdminProfile = exports.getCurrentUser

// POST /api/auth/reset-password-request
// Always answers the same way so the endpoint cannot be used to probe emails.
exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const email = String(req.body.email).trim().toLowerCase()
    const user = await User.findOne({ where: { email } })
    if (user) {
      const token = crypto.randomBytes(32).toString("hex")
      user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
      await user.save()
      await sendEmail(
        user.email,
        "Reset your EventEase password",
        `Use this link within one hour to choose a new password: ${FRONTEND_URL}/reset-password?token=${token}`,
      )
    }
    res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent" })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash("sha256").update(String(req.body.token)).digest("hex")
    const user = await User.findOne({
      where: { resetPasswordToken: hashed, resetPasswordExpires: { [Op.gt]: new Date() } },
    })
    if (!user) {
      return res.status(400).json({ success: false, message: "Reset token is invalid or has expired" })
    }
    user.password = await bcrypt.hash(req.body.password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()
    res.status(200).json({ success: true, message: "Password updated" })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, JWT_SECRET)
    if (decoded.action !== "verify_email") throw new Error("wrong token type")
    await User.update({ emailVerified: true }, { where: { id: decoded.id } })
    res.status(200).json({ success: true, message: "Email verified" })
  } catch (_) {
    res.status(400).json({ success: false, message: "Invalid or expired token" })
  }
}

// POST /api/auth/refresh-token: exchange a still valid token for a fresh one.
exports.refreshToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    if (!user || user.status !== "active") throw new Error("inactive")
    res.status(200).json({ success: true, token: signToken(user) })
  } catch (_) {
    res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}
