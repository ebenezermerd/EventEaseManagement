const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")
const { userAuth, checkRole } = require("../middleware/authMiddleware")

router.post("/user/bookings", userAuth, checkRole("user"), bookingController.bookEvent)
router.get("/user/bookings", userAuth, checkRole("user"), bookingController.getUserBookings)
router.get("/user/bookings/:id", userAuth, checkRole("user"), bookingController.getBookingById)
router.put("/user/bookings/:id/cancel", userAuth, checkRole("user"), bookingController.cancelBooking)
router.get("/bookings/reference/:reference", userAuth, bookingController.getBookingByReference)

router.get("/organizer/events/:eventId/bookings", userAuth, checkRole("organizer"), bookingController.getEventBookings)
router.put("/organizer/bookings/:bookingId/check-in", userAuth, checkRole("organizer"), bookingController.checkInBooking)

module.exports = router
