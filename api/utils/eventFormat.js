// utils/eventFormat.js
// Shapes Event rows into the JSON the web app consumes.

const toNumber = (value) => (value === null || value === undefined ? 0 : Number(value))

const formatTicket = (ticket) => {
  const price = toNumber(ticket.price)
  const quantity = toNumber(ticket.quantity)
  const sold = toNumber(ticket.sold)
  return {
    id: ticket.id,
    name: ticket.name,
    description: ticket.description,
    price,
    currency: ticket.currency || "ETB",
    quantity,
    sold,
    remaining: Math.max(quantity - sold, 0),
    available: Boolean(ticket.available) && quantity - sold > 0,
    isFree: price === 0,
    benefits: ticket.benefits || [],
  }
}

const priceLabel = (tickets, fallback) => {
  if (!tickets || tickets.length === 0) return fallback || "Free"
  const prices = tickets.map((t) => t.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const fmt = (n) => `ETB ${n.toLocaleString("en-US")}`
  if (max === 0) return "Free"
  if (min === max) return fmt(min)
  return min === 0 ? `Free to ${fmt(max)}` : `${fmt(min)} to ${fmt(max)}`
}

const formatEvent = (event, { detailed = false } = {}) => {
  const tickets = (event.TicketTypes || []).map(formatTicket).sort((a, b) => a.price - b.price)
  const organizer = event.Organizer
  const result = {
    id: event.id,
    title: event.title,
    description: event.description,
    longDescription: event.longDescription,
    date: event.eventDate,
    eventDate: event.eventDate,
    time: event.time,
    location: event.location,
    address: event.address,
    region: event.region,
    category: event.category,
    image: event.image,
    gallery: event.gallery || [],
    price: priceLabel(tickets, event.price),
    minPrice: tickets.length ? tickets[0].price : 0,
    isFree: tickets.length === 0 || tickets.every((t) => t.price === 0),
    attendees: toNumber(event.attendees),
    maxAttendees: event.maxAttendees,
    featured: Boolean(event.featured),
    approvalStatus: event.approvalStatus,
    organizerId: event.organizerId,
    organizer: organizer
      ? {
          id: organizer.userId,
          companyName: organizer.companyName,
          name: organizer.User ? organizer.User.name : organizer.companyName,
          logo: organizer.logo,
          description: detailed ? organizer.description : undefined,
          website: detailed ? organizer.website : undefined,
        }
      : null,
    ticketTypes: tickets,
    createdAt: event.createdAt,
  }
  if (detailed) {
    result.schedule = (event.EventSchedules || []).map((s) => ({
      time: s.time,
      title: s.title,
      description: s.description,
      speaker: s.speaker,
    }))
    result.faqs = (event.EventFAQs || []).map((f) => ({ question: f.question, answer: f.answer }))
  }
  return result
}

module.exports = { formatEvent, formatTicket, priceLabel, toNumber }
