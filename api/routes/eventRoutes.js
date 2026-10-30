const express = require("express")
const router = express.Router()
const Joi = require("joi")
const eventController = require("../controllers/eventController")
const { userAuth, checkRole, optionalAuth, requireApprovedOrganizer } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")

const ticketTypeSchema = Joi.object({
  name: Joi.string().trim().max(80).required(),
  description: Joi.string().allow("").max(500).optional(),
  price: Joi.number().min(0).max(1000000).required(),
  quantity: Joi.number().integer().min(1).max(100000).required(),
})

const createEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  longDescription: Joi.string().allow("").max(10000).optional(),
  date: Joi.date().required(),
  time: Joi.string().trim().max(60).required(),
  location: Joi.string().trim().max(150).required(),
  address: Joi.string().trim().max(250).required(),
  region: Joi.string().trim().max(80).required(),
  category: Joi.string().trim().max(60).required(),
  image: Joi.string().allow("").max(1000).optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  maxAttendees: Joi.number().integer().min(1).optional(),
  isFree: Joi.boolean().optional(),
  price: Joi.number().min(0).optional(),
  ticketTypes: Joi.array().items(ticketTypeSchema).max(10).optional(),
})

const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  description: Joi.string().trim().min(10).max(1000).optional(),
  longDescription: Joi.string().allow("").max(10000).optional(),
  date: Joi.date().optional(),
  time: Joi.string().trim().max(60).optional(),
  location: Joi.string().trim().max(150).optional(),
  address: Joi.string().trim().max(250).optional(),
  region: Joi.string().trim().max(80).optional(),
  category: Joi.string().trim().max(60).optional(),
  image: Joi.string().allow("").max(1000).optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  maxAttendees: Joi.number().integer().min(1).optional(),
  featured: Joi.boolean().optional(),
})

router.get("/events/categories", eventController.getEventCategories)
router.get("/events/filters", eventController.getEventFilters)
router.get("/events", eventController.getEvents)
router.get("/events/:id", optionalAuth, eventController.getEventById)
router.get("/events/:id/tickets", eventController.getEventTickets)

router.post(
  "/events",
  userAuth,
  checkRole("organizer"),
  requireApprovedOrganizer,
  validate(createEventSchema),
  eventController.createEvent,
)
router.put("/events/:id", userAuth, checkRole("organizer"), validate(updateEventSchema), eventController.updateEvent)
router.delete("/events/:id", userAuth, checkRole("organizer"), eventController.deleteEvent)

module.exports = router
