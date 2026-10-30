// controllers/organizerController.js
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const { User, Organizer, Event, TicketType, Booking } = require("../models/association")
const { formatEvent, toNumber } = require("../utils/eventFormat")
const { formatBooking } = require("./bookingController")

const PROFILE_FIELDS = ["companyName", "description", "logo", "website", "address", "region", "socialMedia"]

const formatOrganizer = (o) => ({
  userId: o.userId,
  companyName: o.companyName,
  description: o.description,
  logo: o.logo,
  website: o.website,
  address: o.address,
  region: o.region,
  tinNumber: o.tinNumber,
  approvalStatus: o.approvalStatus,
  verified: o.verified,
  totalEvents: o.totalEvents,
  createdAt: o.createdAt,
  user: o.User ? { id: o.User.id, name: o.User.name, email: o.User.email, phone: o.User.phone } : undefined,
})

// POST /api/organizers/apply: an attendee asks to become an organizer.
exports.applyToBeOrganizer = async (req, res, next) => {
  try {
    const { companyName, tinNumber } = req.body
    if (!companyName || !tinNumber) {
      return res.status(400).json({ success: false, message: "companyName and tinNumber are required" })
    }
    if (await Organizer.findOne({ where: { userId: req.user.id } })) {
      return res.status(409).json({ success: false, message: "You already have an organizer profile" })
    }
    if (await Organizer.findOne({ where: { tinNumber } })) {
      return res.status(409).json({ success: false, message: "This TIN number is already registered" })
    }
    const data = { userId: req.user.id, tinNumber, approvalStatus: "pending" }
    for (const key of PROFILE_FIELDS) if (req.body[key] !== undefined) data[key] = req.body[key]
    const organizer = await sequelize.transaction(async (transaction) => {
      const created = await Organizer.create(data, { transaction })
      await User.update({ role: "organizer" }, { where: { id: req.user.id }, transaction })
      return created
    })
    res.status(201).json({
      success: true,
      message: "Application submitted. Sign in again to open the organizer dashboard.",
      organizer: formatOrganizer(organizer),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/profile
exports.getOrganizerProfile = async (req, res, next) => {
  try {
    const organizer = await Organizer.findOne({ where: { userId: req.user.id }, include: [User] })
    if (!organizer) return res.status(404).json({ success: false, message: "Organizer profile not found" })
    res.status(200).json({ success: true, organizer: formatOrganizer(organizer) })
  } catch (error) {
    next(error)
  }
}

// PUT /api/organizers/profile
exports.updateOrganizerProfile = async (req, res, next) => {
  try {
    const organizer = await Organizer.findOne({ where: { userId: req.user.id } })
    if (!organizer) return res.status(404).json({ success: false, message: "Organizer profile not found" })
    const updates = {}
    for (const key of PROFILE_FIELDS) if (req.body[key] !== undefined) updates[key] = req.body[key]
    await organizer.update(updates)
    res.status(200).json({ success: true, organizer: formatOrganizer(organizer) })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/events: every event the organizer owns, any status.
exports.getOrganizerEvents = async (req, res, next) => {
  try {
    const where = { organizerId: req.user.id }
    if (req.query.status && req.query.status !== "all") where.approvalStatus = req.query.status
    const events = await Event.findAll({
      where,
      include: [{ model: Organizer, include: [User] }, TicketType],
      order: [["eventDate", "ASC"]],
    })
    res.status(200).json({ success: true, events: events.map((e) => formatEvent(e)) })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/dashboard: headline numbers from real bookings.
exports.getOrganizerDashboard = async (req, res, next) => {
  try {
    const events = await Event.findAll({ where: { organizerId: req.user.id }, include: [TicketType] })
    const eventIds = events.map((e) => e.id)
    const now = new Date()
    const bookingWhere = { eventId: { [Op.in]: eventIds.length ? eventIds : [null] }, status: { [Op.in]: ["confirmed", "checked-in"] } }
    const [ticketsSold, revenue, recent] = await Promise.all([
      Booking.sum("quantity", { where: bookingWhere }),
      Booking.sum("totalPrice", { where: bookingWhere }),
      Booking.findAll({
        where: bookingWhere,
        include: [
          { model: Event, attributes: ["id", "title", "eventDate", "time", "location", "region", "image", "organizerId"] },
          { model: TicketType, attributes: ["id", "name", "price", "currency"] },
          { model: User, attributes: ["id", "name", "email", "phone"] },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
    ])
    const organizer = await Organizer.findOne({ where: { userId: req.user.id } })
    res.status(200).json({
      success: true,
      approvalStatus: organizer?.approvalStatus,
      stats: {
        totalEvents: events.length,
        upcomingEvents: events.filter((e) => new Date(e.eventDate) >= now && e.approvalStatus === "approved").length,
        ticketsSold: toNumber(ticketsSold),
        revenue: toNumber(revenue),
      },
      upcoming: events
        .filter((e) => new Date(e.eventDate) >= now)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 5)
        .map((e) => formatEvent(e)),
      recentBookings: recent.map(formatBooking),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/attendees?eventId=: confirmed attendees across the organizer's events.
exports.getAllAttendees = async (req, res, next) => {
  try {
    const eventWhere = { organizerId: req.user.id }
    if (req.query.eventId) eventWhere.id = req.query.eventId
    const bookings = await Booking.findAll({
      where: { status: { [Op.in]: ["confirmed", "checked-in", "cancelled"] } },
      include: [
        { model: Event, where: eventWhere, attributes: ["id", "title", "eventDate", "time", "location", "region", "image", "organizerId"] },
        { model: TicketType, attributes: ["id", "name", "price", "currency"] },
        { model: User, attributes: ["id", "name", "email", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json({ success: true, attendees: bookings.map(formatBooking) })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/events/:eventId/attendees
exports.getEventAttendees = async (req, res, next) => {
  req.query.eventId = req.params.eventId
  const event = await Event.findByPk(req.params.eventId).catch(() => null)
  if (!event || event.organizerId !== req.user.id) {
    return res.status(404).json({ success: false, message: "Event not found" })
  }
  return exports.getAllAttendees(req, res, next)
}

// PUT /api/organizers/events/:eventId/attendees/:attendeeId/check-in (attendeeId is the booking id)
exports.checkInAttendee = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.attendeeId, eventId: req.params.eventId },
      include: [Event],
    })
    if (!booking || booking.Event.organizerId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }
    if (booking.status !== "confirmed") {
      return res.status(400).json({ success: false, message: `A ${booking.status} booking cannot be checked in` })
    }
    await booking.update({ status: "checked-in", checkedInAt: new Date() })
    res.status(200).json({ success: true, message: "Attendee checked in" })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizers/events/:id/analytics: ticket sales per type for one event.
exports.getEventAnalytics = async (req, res, next) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, organizerId: req.user.id }, include: [TicketType] })
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })
    const formatted = formatEvent(event)
    const revenue = formatted.ticketTypes.reduce((sum, t) => sum + t.sold * t.price, 0)
    res.status(200).json({
      success: true,
      analytics: {
        eventId: event.id,
        attendees: formatted.attendees,
        capacity: formatted.ticketTypes.reduce((sum, t) => sum + t.quantity, 0),
        revenue,
        ticketTypes: formatted.ticketTypes.map((t) => ({ name: t.name, sold: t.sold, quantity: t.quantity, price: t.price })),
      },
    })
  } catch (error) {
    next(error)
  }
}
