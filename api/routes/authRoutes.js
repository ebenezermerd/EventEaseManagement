const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const validate = require("../middleware/validate")
const { userAuth } = require("../middleware/authMiddleware")
const {
  loginSchema,
  registerSchema,
  resetRequestSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require("../validation/authSchemas")

router.post("/register", validate(registerSchema), authController.register)
router.post("/user/register", validate(registerSchema), authController.register)
router.post("/organizer/register", validate(registerSchema), authController.register)

router.post("/login", validate(loginSchema), authController.login)
router.post("/user/login", validate(loginSchema), authController.login)
router.post("/organizer/login", validate(loginSchema), authController.login)
router.post("/admin/login", validate(loginSchema), authController.login)

router.post("/logout", authController.logout)
router.get("/me", userAuth, authController.getCurrentUser)
router.get("/admin/me", userAuth, authController.getAdminProfile)

router.post("/reset-password-request", validate(resetRequestSchema), authController.resetPasswordRequest)
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken)

module.exports = router
