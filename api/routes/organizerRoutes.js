const express = require("express")
const router = express.Router()
const organizerController = require("../controllers/organizerController")
const { userAuth, checkRole } = require("../middleware/authMiddleware")

const organizerOnly = [userAuth, checkRole("organizer")]

router.post("/organizers/apply", userAuth, organizerController.applyToBeOrganizer)

// Plural paths are canonical; singular aliases keep older clients working.
for (const base of ["/organizers", "/organizer"]) {
  router.get(`${base}/profile`, organizerOnly, organizerController.getOrganizerProfile)
  router.put(`${base}/profile`, organizerOnly, organizerController.updateOrganizerProfile)
  router.get(`${base}/events`, organizerOnly, organizerController.getOrganizerEvents)
  router.get(`${base}/dashboard`, organizerOnly, organizerController.getOrganizerDashboard)
  router.get(`${base}/attendees`, organizerOnly, organizerController.getAllAttendees)
  router.get(`${base}/events/:eventId/attendees`, organizerOnly, organizerController.getEventAttendees)
  router.put(`${base}/events/:eventId/attendees/:attendeeId/check-in`, organizerOnly, organizerController.checkInAttendee)
  router.get(`${base}/events/:id/analytics`, organizerOnly, organizerController.getEventAnalytics)
}

module.exports = router
