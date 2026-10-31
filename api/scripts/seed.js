// scripts/seed.js
// Rebuilds the schema and loads demo data. Rerunnable: every run drops all
// tables and recreates the same categories, events and demo accounts.
//
//   npm run seed            (uses DATABASE_URL from the environment or .env)
//
// Demo accounts share DEMO_PASSWORD (default shown on the login page).
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const sequelize = require("../config/database")
const {
  User,
  Organizer,
  Event,
  TicketType,
  Booking,
  Category,
  EventSchedule,
  EventFAQ,
} = require("../models/association")
// Models that association.js does not import still need tables.
require("../models/systemSetting")
require("../models/fileUpload")
require("../models/userEventRegistration")

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "EventEase2026"

const categories = [
  ["Music", "Concerts, live bands and DJ nights", "music"],
  ["Technology", "Tech summits, hackathons and developer meetups", "cpu"],
  ["Business", "Networking, startup pitches and industry forums", "briefcase"],
  ["Arts & Culture", "Exhibitions, heritage and performing arts", "palette"],
  ["Food & Drink", "Coffee ceremonies, tastings and food fairs", "coffee"],
  ["Sports & Fitness", "Runs, tournaments and wellness", "trophy"],
  ["Education", "Workshops, bootcamps and talks", "graduation-cap"],
  ["Festivals", "Holidays and multi day celebrations", "party-popper"],
]

const at = (iso) => new Date(`${iso}T00:00:00+03:00`)

// [title, category, city, region, venue, address, date, time, image, tickets, description, featured]
const events = [
  [
    "Addis Tech Summit",
    "Technology",
    "Addis Ababa",
    "Addis Ababa",
    "Millennium Hall",
    "Millennium Hall, Bole Road, Addis Ababa",
    "2026-12-05",
    "9:00 AM to 5:00 PM",
    "/assets/image (24).jpg",
    [["General admission", 0, 400], ["VIP with workshop access", 1500, 60]],
    "A day of keynotes, product demos and hands on workshops with founders and engineers building for Ethiopia.",
    true,
  ],
  [
    "Hawassa Lakeside Coffee Festival",
    "Food & Drink",
    "Hawassa",
    "Sidama",
    "Lewi Resort grounds",
    "Lake Hawassa shore, Hawassa",
    "2026-12-12",
    "10:00 AM to 7:00 PM",
    "/assets/image (4).jpg",
    [["Entry", 0, 600], ["Cupping session", 350, 80]],
    "Taste single origin coffees from Sidama and Yirgacheffe growers, join a traditional buna ceremony and meet local roasters.",
    true,
  ],
  [
    "Startup Pitch Night Addis",
    "Business",
    "Addis Ababa",
    "Addis Ababa",
    "iceaddis",
    "Arat Kilo, Addis Ababa University area, Addis Ababa",
    "2026-12-17",
    "5:30 PM to 9:00 PM",
    "/assets/image (10).jpg",
    [["Audience seat", 0, 150]],
    "Ten early stage founders pitch to investors and the crowd votes for the audience award.",
    false,
  ],
  [
    "Gondar Timket Heritage Walk",
    "Festivals",
    "Gondar",
    "Amhara",
    "Fasil Ghebbi",
    "Fasilides Bath and Royal Enclosure, Gondar",
    "2027-01-19",
    "7:00 AM to 1:00 PM",
    "/assets/hero-first.jpg",
    [["Guided walk", 800, 120]],
    "A guided walk through the Timket celebrations at the Fasilides Bath with a historian from the Royal Enclosure.",
    true,
  ],
  [
    "Bahir Dar Jazz by the Lake",
    "Music",
    "Bahir Dar",
    "Amhara",
    "Kuriftu Lake Tana",
    "Lake Tana waterfront, Bahir Dar",
    "2027-01-30",
    "7:00 PM to 11:00 PM",
    "/assets/image (9).jpg",
    [["Standard", 600, 250], ["Table for four", 3000, 20]],
    "Ethio jazz classics and new compositions performed on the shore of Lake Tana.",
    false,
  ],
  [
    "Mekelle Open Data Hackathon",
    "Technology",
    "Mekelle",
    "Tigray",
    "Mekelle University, Arid campus",
    "Arid campus, Mekelle University, Mekelle",
    "2027-02-13",
    "8:30 AM to 8:00 PM",
    "/assets/image (15).jpg",
    [["Participant", 0, 120]],
    "Teams build tools on top of public agriculture and water data. Mentors, meals and prizes included.",
    false,
  ],
  [
    "Dire Dawa Food Market",
    "Food & Drink",
    "Dire Dawa",
    "Dire Dawa",
    "Kezira old town square",
    "Kezira, Dire Dawa",
    "2027-02-27",
    "3:00 PM to 10:00 PM",
    "/assets/image (21).jpg",
    [["Entry", 0, 1000]],
    "Street food from Harari, Somali and Oromo kitchens, live music and a night market under the arcades.",
    true,
  ],
  [
    "Addis Ababa 10K Community Run",
    "Sports & Fitness",
    "Addis Ababa",
    "Addis Ababa",
    "Meskel Square",
    "Meskel Square, Addis Ababa",
    "2027-03-07",
    "6:30 AM to 10:30 AM",
    "/assets/image (24).jpg",
    [["Runner bib", 300, 2000]],
    "A flat 10 km loop through the city centre with timing chips, water stations and a finisher medal.",
    false,
  ],
  [
    "Lalibela Photography Workshop",
    "Education",
    "Lalibela",
    "Amhara",
    "Roha Hotel",
    "Roha Hotel, Lalibela",
    "2027-03-20",
    "9:00 AM to 4:00 PM",
    "/assets/image (30).jpg",
    [["Workshop seat", 1200, 25]],
    "Learn composition and low light technique with a professional photographer, ending with a shoot at the rock hewn churches.",
    false,
  ],
  [
    "Adama Small Business Expo",
    "Business",
    "Adama",
    "Oromia",
    "Adama Science and Technology University hall",
    "ASTU main hall, Adama",
    "2027-04-10",
    "9:00 AM to 6:00 PM",
    "/assets/image (8).jpg",
    [["Visitor pass", 0, 800], ["Exhibitor booth", 2500, 40]],
    "Over a hundred local manufacturers and service businesses show their products with free sessions on export and financing.",
    false,
  ],
  [
    "Jimma Arts and Crafts Fair",
    "Arts & Culture",
    "Jimma",
    "Oromia",
    "Aba Jifar Palace grounds",
    "Aba Jifar Palace, Jimma",
    "2027-05-01",
    "10:00 AM to 6:00 PM",
    "/assets/image (18).jpg",
    [["Entry", 0, 500]],
    "Weavers, potters and painters from the southwest sell and demonstrate their work around the historic palace.",
    false,
  ],
]

const hash = (pw) => bcrypt.hash(pw, 10)
const randomPassword = () => crypto.randomBytes(24).toString("base64")
const ref = () => `EE${crypto.randomBytes(5).toString("hex").toUpperCase()}`

async function seed() {
  console.log("Resetting schema...")
  await sequelize.sync({ force: true })

  const demoHash = await hash(DEMO_PASSWORD)

  await Category.bulkCreate(
    categories.map(([name, description, icon]) => ({
      name,
      description,
      icon,
      slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    })),
  )

  const admin = await User.create({
    name: "Demo Admin",
    email: "demo-admin@eventease.app",
    password: demoHash,
    role: "admin",
    status: "active",
    emailVerified: true,
  })

  const organizerUser = await User.create({
    name: "Selam Tesfaye",
    email: "demo-organizer@eventease.app",
    password: demoHash,
    phone: "+251 911 000 001",
    role: "organizer",
    status: "active",
    emailVerified: true,
  })
  const organizer = await Organizer.create({
    userId: organizerUser.id,
    companyName: "Habesha Events PLC",
    description: "Conferences, festivals and community events across Ethiopia.",
    website: "https://eventease.app",
    address: "Bole Road, Addis Ababa",
    region: "Addis Ababa",
    tinNumber: "0000000001",
    approvalStatus: "approved",
    verified: true,
  })

  const attendee = await User.create({
    name: "Dawit Bekele",
    email: "demo-attendee@eventease.app",
    password: demoHash,
    phone: "+251 911 000 002",
    role: "attendee",
    status: "active",
    emailVerified: true,
  })

  // A second approved organizer and one applicant waiting for the admin.
  const hubUser = await User.create({
    name: "Mahlet Girma",
    email: "hello@addiscreativehub.example",
    password: await hash(randomPassword()),
    role: "organizer",
    status: "active",
  })
  const hub = await Organizer.create({
    userId: hubUser.id,
    companyName: "Addis Creative Hub",
    description: "Arts, music and maker events.",
    region: "Addis Ababa",
    tinNumber: "0000000002",
    approvalStatus: "approved",
    verified: true,
  })
  const applicantUser = await User.create({
    name: "Yonas Alemu",
    email: "yonas@lalibelatours.example",
    password: await hash(randomPassword()),
    role: "organizer",
    status: "active",
  })
  await Organizer.create({
    userId: applicantUser.id,
    companyName: "Lalibela Heritage Tours",
    description: "Guided cultural tours and heritage walks in northern Ethiopia.",
    region: "Amhara",
    tinNumber: "0000000003",
    approvalStatus: "pending",
  })

  const createdEvents = []
  for (const [i, e] of events.entries()) {
    const [title, category, city, region, venue, address, date, time, image, tickets, description, featured] = e
    const owner = i % 4 === 3 || category === "Music" ? hub : organizer
    const event = await Event.create({
      title,
      description,
      longDescription: `${description}\n\nVenue: ${venue}, ${city}. Doors open 30 minutes before the start. Bring your booking reference from EventEase to the entrance.`,
      eventDate: at(date),
      time,
      location: `${venue}, ${city}`,
      address,
      region,
      category,
      image,
      organizerId: owner.userId,
      approvalStatus: "approved",
      featured,
      maxAttendees: tickets.reduce((n, t) => n + t[2], 0),
    })
    const types = []
    for (const [name, price, quantity] of tickets) {
      types.push(
        await TicketType.create({
          eventId: event.id,
          name,
          price,
          quantity,
          sold: 0,
          currency: "ETB",
          description: price === 0 ? "Free, registration required" : null,
        }),
      )
    }
    await EventSchedule.bulkCreate([
      { eventId: event.id, time: time.split(" to ")[0], title: "Doors open and registration", order: 1 },
      { eventId: event.id, time: "Main programme", title, description, order: 2 },
    ])
    await EventFAQ.bulkCreate([
      { eventId: event.id, question: "How do I get in?", answer: "Show the booking reference from your EventEase dashboard at the entrance.", order: 1 },
      { eventId: event.id, question: "Can I cancel?", answer: "Yes, cancel from your dashboard any time before the event.", order: 2 },
    ])
    await Organizer.increment("totalEvents", { where: { userId: owner.userId } })
    createdEvents.push({ event, types })
  }

  // A few confirmed bookings so organizer and admin views are not empty.
  const guests = []
  for (const [name, email] of [
    ["Hanna Tadesse", "hanna@example.com"],
    ["Abel Mekonnen", "abel@example.com"],
    ["Rahel Assefa", "rahel@example.com"],
  ]) {
    guests.push(await User.create({ name, email, password: await hash(randomPassword()), role: "attendee", status: "active" }))
  }
  const book = async (user, entry, quantity) => {
    const ticket = entry.types[0]
    await Booking.create({
      userId: user.id,
      eventId: entry.event.id,
      ticketTypeId: ticket.id,
      quantity,
      totalPrice: Number(ticket.price) * quantity,
      status: "confirmed",
      bookingReference: ref(),
    })
    await ticket.increment("sold", { by: quantity })
    await entry.event.increment("attendees", { by: quantity })
  }
  await book(attendee, createdEvents[0], 1)
  await book(guests[0], createdEvents[0], 2)
  await book(guests[1], createdEvents[0], 1)
  await book(guests[2], createdEvents[2], 1)
  await book(guests[0], createdEvents[6], 3)

  console.log(`Seeded ${categories.length} categories, ${events.length} events and demo accounts:`)
  for (const u of [admin, organizerUser, attendee]) console.log(`  ${u.role.padEnd(9)} ${u.email}`)
}

seed()
  .then(() => sequelize.close())
  .catch(async (error) => {
    console.error("Seed failed:", error)
    await sequelize.close()
    process.exit(1)
  })
