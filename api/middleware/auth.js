// middleware/auth.js
// Kept for older imports; the implementation lives in authMiddleware.js.
const { userAuth, checkRole, optionalAuth } = require("./authMiddleware")

module.exports = {
  verifyToken: optionalAuth,
  userAuth,
  checkRole,
  optionalAuth,
}
