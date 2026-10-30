// controllers/bookingController.js
const crypto = require("crypto")
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const { Booking, User, Event, TicketType } = require("../models/association")
const chapa = require("../services/chapa")
const { API_BASE_URL, FRONTEND_URL } = require("../config/config")
const { toNumber } = require("../utils/eventFormat")

const MAX_PER_BOOKING = 10
const reference = (prefix) => `${prefix}${crypto.randomBytes(5).toString("hex").toUpperCase()}`

const bookingInclude = [
  { model: Event, attributes: ["id", "title", "eventDate", "time", "location", "region", "image", "organizerId"] },
  { model: TicketType, attributes: ["id", "name", "price", "currency"] },
]

const formatBooking = (b) => ({
  id: b.id,
  bookingReference: b.bookingReference,
  status: b.status,
  quantity: b.quantity,
  totalPrice: toNumber(b.totalPrice),
  currency: b.TicketType?.currency || "ETB",
  createdAt: b.createdAt,
  checkedInAt: b.checkedInAt,
  event: b.Event
    ? {
        id: b.Event.id,
        title: b.Event.title,
        date: b.Event.eventDate,
        time: b.Event.time,
        location: b.Event.location,
        region: b.Event.region,
        image: b.Event.image,
      }
    : null,
  ticketType: b.TicketType ? { id: b.TicketType.id, name: b.TicketType.name, price: toNumber(b.TicketType.price) } : null,
  attendee: b.User ? { id: b.User.id, name: b.User.name, email: b.User.email, phone: b.User.phone } : undefined,
})

// Confirms a booking and counts it against ticket and event totals.
async function confirmBooking(booking, transaction) {
  await booking.update({ status: "confirmed" }, { transaction })
  await TicketType.increment("sold", { by: booking.quantity, where: { id: booking.ticketTypeId }, transaction })
  await Event.increment("attendees", { by: booking.quantity, where: { id: booking.eventId }, transaction })
}

// POST /api/user/bookings { eventId, ticketTypeId, quantity }
exports.bookEvent = async (req, res, next) => {
  const { eventId, ticketTypeId } = req.body
  const quantity = Number(req.body.quantity || 1)
  if (!eventId || !ticketTypeId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PER_BOOKING) {
    return res.status(400).json({
      success: false,
      message: `Provide eventId, ticketTypeId and a quantity between 1 and ${MAX_PER_BOOKING}`,
    })
  }

  try {
    const outcome = await sequelize.transaction(async (transaction) => {
      const event = await Event.findOne({ where: { id: eventId, approvalStatus: "approved" }, transaction })
      if (!event) return { status: 404, body: { success: false, message: "Event not found" } }
      if (new Date(event.eventDate) < new Date(new Date().toDateString())) {
        return { status: 400, body: { success: false, message: "This event has already taken place" } }
      }
      // Row lock so concurrent bookings cannot oversell the ticket type.
      const ticket = await TicketType.findOne({
        where: { id: ticketTypeId, eventId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!ticket || !ticket.available) {
        return { status: 404, body: { success: false, message: "Ticket type not found for this event" } }
      }
      if (ticket.quantity - ticket.sold < quantity) {
        return { status: 409, body: { success: false, message: "Not enough tickets left" } }
      }

      const totalPrice = toNumber(ticket.price) * quantity
      if (totalPrice > 0 && !chapa.isEnabled()) {
        return {
          status: 402,
          body: {
            success: false,
            code: "PAYMENTS_DISABLED",
            message: "Paid checkout is in test mode and coming soon. Free tickets can be booked now.",
          },
        }
      }

      const booking = await Booking.create(
        {
          userId: req.user.id,
          eventId,
          ticketTypeId,
          quantity,
          totalPrice,
          status: "pending",
          bookingReference: reference("EE"),
          paymentReference: totalPrice > 0 ? reference("TX") : null,
        },
        { transaction },
      )
      if (totalPrice === 0) await confirmBooking(booking, transaction)
      return { booking, event, totalPrice }
    })

    if (outcome.status) return res.status(outcome.status).json(outcome.body)

    const { booking, event, totalPrice } = outcome
    if (totalPrice > 0) {
      const user = await User.findByPk(req.user.id)
      const [firstName, ...rest] = (user.name || "Guest").split(" ")
      try {
        const checkoutUrl = await chapa.initializeTransaction({
          amount: totalPrice,
          email: user.email,
          firstName,
          lastName: rest.join(" ") || firstName,
          txRef: booking.paymentReference,
          callbackUrl: `${API_BASE_URL}/api/payments/chapa/callback`,
          returnUrl: `${FRONTEND_URL}/dashboard/attendee?payment=${booking.paymentReference}`,
          title: event.title,
        })
        return res.status(201).json({ success: true, requiresPayment: true, checkoutUrl, booking: { id: booking.id } })
      } catch (error) {
        await booking.update({ status: "cancelled" })
        console.error("[chapa] initialize failed:", error.message)
        return res.status(502).json({ success: false, message: "Could not start the payment, please try again" })
      }
    }

    const full = await Booking.findByPk(booking.id, { include: bookingInclude })
    res.status(201).json({ success: true, message: "Booking confirmed", booking: formatBooking(full) })
  } catch (error) {
    next(error)
  }
}

// GET /api/user/bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: bookingInclude,
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json({ success: true, bookings: bookings.map(formatBooking) })
  } catch (error) {
    next(error)
  }
}

// GET /api/user/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id }, include: bookingInclude })
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" })
    res.status(200).json({ success: true, booking: formatBooking(booking) })
  } catch (error) {
    next(error)
  }
}

// GET /api/bookings/reference/:reference: the attendee, the event organizer or an admin.
exports.getBookingByReference = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { bookingReference: req.params.reference },
      include: [...bookingInclude, { model: User, attributes: ["id", "name", "email", "phone"] }],
    })
    const allowed =
      booking &&
      (req.user.role === "admin" || booking.userId === req.user.id || booking.Event?.organizerId === req.user.id)
    if (!allowed) return res.status(404).json({ success: false, message: "Booking not found" })
    res.status(200).json({ success: true, booking: formatBooking(booking) })
  } catch (error) {
    next(error)
  }
}

// PUT /api/user/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const result = await sequelize.transaction(async (transaction) => {
      const booking = await Booking.findOne({
        where: { id: req.params.id, userId: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!booking) return { status: 404, message: "Booking not found" }
      if (booking.status === "cancelled") return { status: 400, message: "Booking is already cancelled" }
      if (booking.status === "checked-in") return { status: 400, message: "Checked in bookings cannot be cancelled" }
      const wasConfirmed = booking.status === "confirmed"
      await booking.update({ status: "cancelled" }, { transaction })
      if (wasConfirmed) {
        await TicketType.decrement("sold", { by: booking.quantity, where: { id: booking.ticketTypeId }, transaction })
        await Event.decrement("attendees", { by: booking.quantity, where: { id: booking.eventId }, transaction })
      }
      return { status: 200, message: "Booking cancelled" }
    })
    res.status(result.status).json({ success: result.status === 200, message: result.message })
  } catch (error) {
    next(error)
  }
}

// GET /api/organizer/events/:eventId/bookings
exports.getEventBookings = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId)
    if (!event || (req.user.role !== "admin" && event.organizerId !== req.user.id)) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }
    const bookings = await Booking.findAll({
      where: { eventId: event.id, status: { [Op.ne]: "pending" } },
      include: [...bookingInclude, { model: User, attributes: ["id", "name", "email", "phone"] }],
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json({ success: true, bookings: bookings.map(formatBooking) })
  } catch (error) {
    next(error)
  }
}

// PUT /api/organizer/bookings/:bookingId/check-in
exports.checkInBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId, { include: bookingInclude })
    if (!booking || (req.user.role !== "admin" && booking.Event?.organizerId !== req.user.id)) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }
    if (booking.status !== "confirmed") {
      return res.status(400).json({ success: false, message: `A ${booking.status} booking cannot be checked in` })
    }
    await booking.update({ status: "checked-in", checkedInAt: new Date() })
    res.status(200).json({ success: true, message: "Attendee checked in", booking: formatBooking(booking) })
  } catch (error) {
    next(error)
  }
}

// Marks a pending paid booking as confirmed once Chapa reports success.
exports.settlePayment = async (txRef) => {
  if (!txRef || !chapa.isEnabled()) return { ok: false, reason: "payments disabled" }
  const paid = await chapa.verifyTransaction(txRef)
  if (!paid) return { ok: false, reason: "not paid" }
  return sequelize.transaction(async (transaction) => {
    const booking = await Booking.findOne({
      where: { paymentReference: txRef },
      transaction,
      lock: transaction.LOCK.UPDATE,
    })
    if (!booking) return { ok: false, reason: "unknown reference" }
    if (booking.status === "pending") await confirmBooking(booking, transaction)
    return { ok: true, bookingId: booking.id }
  })
}

exports.formatBooking = formatBooking
