const { TicketType, Event, Booking } = require("../models/association")
const { formatTicket } = require("../utils/eventFormat")

// Only these fields may be set by organizers; sold counts are managed by bookings.
const TICKET_FIELDS = ["name", "description", "price", "quantity", "available", "benefits", "salesStartDate", "salesEndDate"]
const pickTicketFields = (body) => {
  const data = {}
  for (const key of TICKET_FIELDS) if (body[key] !== undefined) data[key] = body[key]
  return data
}

// Get all ticket types for an event
exports.getEventTicketTypes = async (req, res) => {
  try {
    const { eventId } = req.params

    // Check if the event exists
    const event = await Event.findByPk(eventId)
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    const ticketTypes = await TicketType.findAll({
      where: { eventId },
      order: [["price", "ASC"]],
    })

    res.status(200).json({ success: true, ticketTypes: ticketTypes.map(formatTicket) })
  } catch (error) {
    console.error("Error fetching ticket types:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create a new ticket type for an event (organizer only)
exports.createTicketType = async (req, res) => {
  try {
    const { eventId } = req.params
    const organizerId = req.user.id

    // Check if the event exists and belongs to the organizer
    const event = await Event.findOne({
      where: { id: eventId, organizerId },
    })

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you do not have permission to manage this event",
      })
    }

    // Create the ticket type
    if (!req.body.name || req.body.price === undefined || !req.body.quantity) {
      return res.status(400).json({ success: false, message: "name, price and quantity are required" })
    }
    const ticketType = await TicketType.create({
      ...pickTicketFields(req.body),
      eventId,
      sold: 0,
    })

    res.status(201).json({
      success: true,
      message: "Ticket type created successfully",
      ticketType,
    })
  } catch (error) {
    console.error("Error creating ticket type:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update a ticket type (organizer only)
exports.updateTicketType = async (req, res) => {
  try {
    const { id } = req.params
    const organizerId = req.user.id

    // Find the ticket type
    const ticketType = await TicketType.findByPk(id, {
      include: [{ model: Event }],
    })

    if (!ticketType) {
      return res.status(404).json({ success: false, message: "Ticket type not found" })
    }

    // Check if the event belongs to the organizer
    if (ticketType.Event.organizerId !== organizerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this ticket type",
      })
    }

    // Update the ticket type
    const updates = pickTicketFields(req.body)
    if (updates.quantity !== undefined && Number(updates.quantity) < ticketType.sold) {
      return res.status(400).json({ success: false, message: "Quantity cannot be lower than tickets already sold" })
    }
    await ticketType.update(updates)

    res.status(200).json({
      success: true,
      message: "Ticket type updated successfully",
      ticketType,
    })
  } catch (error) {
    console.error("Error updating ticket type:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete a ticket type (organizer only)
exports.deleteTicketType = async (req, res) => {
  try {
    const { id } = req.params
    const organizerId = req.user.id

    // Find the ticket type
    const ticketType = await TicketType.findByPk(id, {
      include: [{ model: Event }],
    })

    if (!ticketType) {
      return res.status(404).json({ success: false, message: "Ticket type not found" })
    }

    // Check if the event belongs to the organizer
    if (ticketType.Event.organizerId !== organizerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this ticket type",
      })
    }

    // Delete the ticket type
    const bookings = await Booking.count({ where: { ticketTypeId: ticketType.id } })
    if (bookings > 0) {
      await ticketType.update({ available: false })
      return res.status(200).json({ success: true, message: "Ticket type has bookings, so sales were closed instead" })
    }
    await ticketType.destroy()

    res.status(200).json({
      success: true,
      message: "Ticket type deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ticket type:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}
