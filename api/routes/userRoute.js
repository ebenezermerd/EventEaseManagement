// routes/userRoute.js: mounted at /api/users
const express = require("express")
const router = express.Router()
const Joi = require("joi")
const userController = require("../controllers/userController")
const { userAuth } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  phone: Joi.string().allow("").max(30).optional(),
  avatar: Joi.string().allow("").max(1000).optional(),
  bio: Joi.string().allow("").max(1000).optional(),
  address: Joi.string().allow("").max(250).optional(),
})

const saveEventSchema = Joi.object({
  eventId: Joi.string().required(),
  notes: Joi.string().allow("").optional(),
})

router.use(userAuth)

router.get("/profile", userController.getProfile)
router.put("/profile", validate(updateProfileSchema), userController.updateProfile)

router.get("/saved-events", userController.getSavedEvents)
router.post("/saved-events", validate(saveEventSchema), userController.saveEvent)
router.delete("/saved-events/:eventId", userController.removeSavedEvent)
router.delete("/saved-events", userController.clearSavedEvents)

router.get("/notifications", userController.getUserNotifications)
router.put("/notifications/read-all", userController.markAllNotificationsAsRead)
router.put("/notifications/:id/read", userController.markNotificationAsRead)
router.delete("/notifications/read", userController.clearReadNotifications)
router.delete("/notifications/:id", userController.deleteNotification)

module.exports = router
