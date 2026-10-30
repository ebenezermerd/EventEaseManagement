// controllers/eventController.js
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const { Event, Organizer, TicketType, User, EventSchedule, EventFAQ, Booking } = require("../models/association")
const { getPagination, getPagingData } = require("../utils/pagination")
const { formatEvent } = require("../utils/eventFormat")

const AUTO_APPROVE_EVENTS = process.env.AUTO_APPROVE_EVENTS !== "false"

const organizerInclude = {
  model: Organizer,
  attributes: ["userId", "companyName", "logo", "description", "website"],
  include: [{ model: User, attributes: ["name"] }],
}

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// GET /api/events: public catalogue of approved events.
exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category, location, region, featured, sort, when = "upcoming" } = req.query
    const { offset, limit: pageSize } = getPagination(Number(page) || 1, Math.min(Number(limit) || 12, 50))

    const and = [{ approvalStatus: "approved" }]
    if (search) {
      and.push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } },
        ],
      })
    }
    if (category && category !== "all") and.push({ category: { [Op.iLike]: category } })
    const place = location || region
    if (place && place !== "all") {
      and.push({
        [Op.or]: [
          { location: { [Op.iLike]: `%${place}%` } },
          { address: { [Op.iLike]: `%${place}%` } },
          { region: { [Op.iLike]: `%${place}%` } },
        ],
      })
    }
    if (featured === "true") and.push({ featured: true })
    if (when === "upcoming") and.push({ eventDate: { [Op.gte]: startOfToday() } })
    if (when === "past") and.push({ eventDate: { [Op.lt]: startOfToday() } })

    let order = [["eventDate", "ASC"]]
    if (sort === "popularity") order = [["attendees", "DESC"]]
    if (sort === "newest") order = [["createdAt", "DESC"]]

    const { count, rows } = await Event.findAndCountAll({
      where: { [Op.and]: and },
      include: [organizerInclude, { model: TicketType }],
      order,
      offset,
      limit: pageSize,
      distinct: true,
    })

    res.status(200).json({
      success: true,
      events: rows.map((e) => formatEvent(e)),
      pagination: getPagingData(count, Number(page) || 1, pageSize),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/events/:id: approved events for everyone, any status for the owner or an admin.
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [organizerInclude, { model: TicketType }, { model: EventSchedule }, { model: EventFAQ }],
    })
    const canSeeUnpublished =
      req.user && (req.user.role === "admin" || (event && event.organizerId === req.user.id))
    if (!event || (event.approvalStatus !== "approved" && !canSeeUnpublished)) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }
    res.status(200).json({ success: true, event: formatEvent(event, { detailed: true }) })
  } catch (error) {
    if (error.name === "SequelizeDatabaseError") {
      return res.status(404).json({ success: false, message: "Event not found" })
    }
    next(error)
  }
}

// GET /api/events/:id/tickets
exports.getEventTickets = async (req, res, next) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, approvalStatus: "approved" }, include: [TicketType] })
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })
    res.status(200).json({ success: true, ticketTypes: formatEvent(event).ticketTypes })
  } catch (error) {
    next(error)
  }
}

const EDITABLE_FIELDS = [
  "title",
  "description",
  "longDescription",
  "time",
  "location",
  "address",
  "region",
  "category",
  "image",
  "gallery",
  "maxAttendees",
]

// POST /api/events: approved organizers create events with one or more ticket types.
exports.createEvent = async (req, res, next) => {
  try {
    if (!req.organizer) {
      return res.status(403).json({ success: false, message: "Only organizer accounts can create events" })
    }
    const body = req.body
    const ticketTypes =
      Array.isArray(body.ticketTypes) && body.ticketTypes.length
        ? body.ticketTypes
        : [
            {
              name: body.isFree || !body.price ? "General admission" : body.ticketInfo?.name || "Standard",
              description: body.ticketInfo?.description || "",
              price: body.isFree ? 0 : Number(body.price || body.ticketInfo?.price || 0),
              quantity: body.maxAttendees || 100,
            },
          ]

    const event = await sequelize.transaction(async (transaction) => {
      const data = {}
      for (const key of EDITABLE_FIELDS) if (body[key] !== undefined) data[key] = body[key]
      const created = await Event.create(
        {
          ...data,
          longDescription: body.longDescription || body.description,
          eventDate: body.date,
          organizerId: req.organizer.userId,
          approvalStatus: AUTO_APPROVE_EVENTS ? "approved" : "pending",
        },
        { transaction },
      )
      for (const t of ticketTypes) {
        await TicketType.create(
          {
            eventId: created.id,
            name: t.name,
            description: t.description || null,
            price: Number(t.price) || 0,
            quantity: Number(t.quantity) || 100,
            sold: 0,
            available: true,
            currency: "ETB",
          },
          { transaction },
        )
      }
      await Organizer.increment("totalEvents", { where: { userId: created.organizerId }, transaction })
      return created
    })

    const full = await Event.findByPk(event.id, { include: [organizerInclude, TicketType] })
    res.status(201).json({
      success: true,
      message: AUTO_APPROVE_EVENTS ? "Event published" : "Event created and waiting for approval",
      event: formatEvent(full),
    })
  } catch (error) {
    next(error)
  }
}

const findOwnedEvent = async (req) => {
  const event = await Event.findByPk(req.params.id)
  if (!event) return null
  if (req.user.role === "admin" || event.organizerId === req.user.id) return event
  return null
}

// PUT /api/events/:id: the owning organizer or an admin.
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await findOwnedEvent(req)
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or you cannot edit it" })
    }
    const updates = {}
    for (const key of EDITABLE_FIELDS) if (req.body[key] !== undefined) updates[key] = req.body[key]
    if (req.body.date) updates.eventDate = req.body.date
    if (req.user.role === "admin" && req.body.featured !== undefined) updates.featured = req.body.featured
    await event.update(updates)
    const full = await Event.findByPk(event.id, { include: [organizerInclude, TicketType] })
    res.status(200).json({ success: true, message: "Event updated", event: formatEvent(full) })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/events/:id: events with bookings are cancelled instead of deleted.
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await findOwnedEvent(req)
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or you cannot delete it" })
    }
    const bookings = await Booking.count({ where: { eventId: event.id } })
    if (bookings > 0) {
      await event.update({ approvalStatus: "cancelled" })
      return res.status(200).json({ success: true, message: "Event has bookings, so it was cancelled instead" })
    }
    await sequelize.transaction(async (transaction) => {
      await TicketType.destroy({ where: { eventId: event.id }, transaction })
      await event.destroy({ transaction })
    })
    res.status(200).json({ success: true, message: "Event deleted" })
  } catch (error) {
    next(error)
  }
}

// GET /api/events/categories: category names with approved event counts.
exports.getEventCategories = async (req, res, next) => {
  try {
    const rows = await Event.findAll({
      attributes: ["category", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      where: { approvalStatus: "approved" },
      group: ["category"],
      order: [[sequelize.literal('"count"'), "DESC"]],
      raw: true,
    })
    res.status(200).json({
      success: true,
      categories: rows.map((r) => ({ name: r.category, count: Number(r.count) })),
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/events/filters: distinct values for the browse filters.
exports.getEventFilters = async (req, res, next) => {
  try {
    const where = { approvalStatus: "approved" }
    const [categories, regions] = await Promise.all([
      Event.findAll({ attributes: ["category"], where, group: ["category"], raw: true }),
      Event.findAll({ attributes: ["region"], where, group: ["region"], raw: true }),
    ])
    res.status(200).json({
      success: true,
      filters: {
        categories: categories.map((c) => c.category).sort(),
        regions: regions.map((r) => r.region).sort(),
      },
    })
  } catch (error) {
    next(error)
  }
}
