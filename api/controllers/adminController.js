// controllers/adminController.js
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const { User, Organizer, Event, TicketType, Booking } = require("../models/association")
const SystemSetting = require("../models/systemSetting")
const { getPagination, getPagingData } = require("../utils/pagination")
const EventRelationship = require("../models/eventRelationship")
const { v4: uuidv4 } = require("uuid")
const { formatEvent, toNumber } = require("../utils/eventFormat")
const sendEmail = require("../middleware/sendEmail")

const paid = { status: { [Op.in]: ["confirmed", "checked-in"] } }

// GET /api/admin/dashboard: platform totals.
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [users, attendees, organizers, pendingOrganizers, events, upcomingEvents, bookings, tickets, revenue] =
      await Promise.all([
        User.count(),
        User.count({ where: { role: "attendee" } }),
        Organizer.count({ where: { approvalStatus: "approved" } }),
        Organizer.count({ where: { approvalStatus: "pending" } }),
        Event.count(),
        Event.count({ where: { approvalStatus: "approved", eventDate: { [Op.gte]: new Date() } } }),
        Booking.count({ where: paid }),
        Booking.sum("quantity", { where: paid }),
        Booking.sum("totalPrice", { where: paid }),
      ])
    res.status(200).json({
      success: true,
      stats: {
        users,
        attendees,
        organizers,
        pendingOrganizers,
        events,
        upcomingEvents,
        bookings,
        ticketsSold: toNumber(tickets),
        revenue: toNumber(revenue),
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/users?search=&role=&page=
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query
    const { offset, limit: pageSize } = getPagination(Number(page) || 1, Math.min(Number(limit) || 20, 100))
    const where = {}
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }]
    if (role && role !== "all") where.role = role
    if (status && status !== "all") where.status = status
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ["id", "name", "email", "phone", "role", "status", "joinDate", "lastLogin", "createdAt"],
      order: [["createdAt", "DESC"]],
      offset,
      limit: pageSize,
    })
    res.status(200).json({ success: true, users: rows, pagination: getPagingData(count, Number(page) || 1, pageSize) })
  } catch (error) {
    next(error)
  }
}

// PUT /api/admin/users/:id/status { status: "active" | "inactive" }
exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own status" })
    }
    await user.update({ status: req.body.status })
    res.status(200).json({ success: true, message: `User marked ${req.body.status}` })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/organizers?status=pending
exports.getAllOrganizers = async (req, res, next) => {
  try {
    const { search, status } = req.query
    const where = {}
    if (status && status !== "all") where.approvalStatus = status
    const organizers = await Organizer.findAll({
      where: search ? { ...where, [Op.or]: [{ companyName: { [Op.iLike]: `%${search}%` } }, { "$User.email$": { [Op.iLike]: `%${search}%` } }] } : where,
      include: [{ model: User, attributes: ["id", "name", "email", "phone", "status", "createdAt"] }],
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json({
      success: true,
      organizers: organizers.map((o) => ({
        userId: o.userId,
        companyName: o.companyName,
        description: o.description,
        website: o.website,
        region: o.region,
        address: o.address,
        tinNumber: o.tinNumber,
        approvalStatus: o.approvalStatus,
        verified: o.verified,
        totalEvents: o.totalEvents,
        createdAt: o.createdAt,
        user: o.User,
      })),
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/admin/organizers/:id/status { status: "approved" | "rejected", reason }
exports.updateOrganizerStatus = async (req, res, next) => {
  try {
    const organizer = await Organizer.findByPk(req.params.id, { include: [User] })
    if (!organizer) return res.status(404).json({ success: false, message: "Organizer not found" })
    const { status, reason } = req.body
    await organizer.update({ approvalStatus: status, verified: status === "approved" })
    await sendEmail(
      organizer.User.email,
      `Your EventEase organizer account was ${status}`,
      status === "approved"
        ? "You can now publish events on EventEase."
        : `Your application was not approved. Reason: ${reason || "not specified"}`,
    )
    res.status(200).json({ success: true, message: `Organizer ${status}` })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/events?status=&search=
exports.getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query
    const { offset, limit: pageSize } = getPagination(Number(page) || 1, Math.min(Number(limit) || 50, 100))
    const where = {}
    if (status && status !== "all") where.approvalStatus = status
    if (search) where[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }, { location: { [Op.iLike]: `%${search}%` } }]
    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [{ model: Organizer, include: [{ model: User, attributes: ["name"] }] }, TicketType],
      order: [["eventDate", "ASC"]],
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

// PUT /api/admin/events/:id/status { status: "approved" | "rejected" }
exports.updateEventStatus = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id)
    if (!event) return res.status(404).json({ success: false, message: "Event not found" })
    await event.update({ approvalStatus: req.body.status })
    res.status(200).json({ success: true, message: `Event ${req.body.status}` })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/reports/financial?period=month: booking revenue grouped in Postgres.
exports.getFinancialReports = async (req, res, next) => {
  try {
    const formats = { day: "YYYY-MM-DD", week: "IYYY-IW", month: "YYYY-MM", year: "YYYY" }
    const format = formats[req.query.period] || formats.month
    const period = sequelize.fn("to_char", sequelize.col("Booking.createdAt"), format)
    const [byPeriod, byCategory] = await Promise.all([
      Booking.findAll({
        attributes: [
          [period, "period"],
          [sequelize.fn("SUM", sequelize.col("totalPrice")), "revenue"],
          [sequelize.fn("SUM", sequelize.col("quantity")), "tickets"],
        ],
        where: paid,
        group: [period],
        order: [[period, "ASC"]],
        raw: true,
      }),
      Booking.findAll({
        attributes: [
          [sequelize.col("Event.category"), "category"],
          [sequelize.fn("SUM", sequelize.col("Booking.totalPrice")), "revenue"],
        ],
        include: [{ model: Event, attributes: [] }],
        where: paid,
        group: [sequelize.col("Event.category")],
        raw: true,
      }),
    ])
    res.status(200).json({
      success: true,
      revenueByPeriod: byPeriod.map((r) => ({ period: r.period, revenue: toNumber(r.revenue), tickets: toNumber(r.tickets) })),
      revenueByCategory: byCategory.map((r) => ({ category: r.category, revenue: toNumber(r.revenue) })),
    })
  } catch (error) {
    next(error)
  }
}

exports.getSystemSettings = async (req, res) => {
  try {
    // Get all settings from the database
    const settingsRecords = await SystemSetting.findAll();
    
    // Convert to a key-value object
    const settings = {};
    
    // Default settings in case they don't exist in the database yet
    const defaultSettings = {
      platformFeePercentage: 10,
      featuredEventCost: 1000,
      maintenanceMode: false,
      allowRegistrations: true,
      defaultCurrency: "ETB",
      supportedPaymentMethods: ["credit_card", "bank_transfer", "mobile_money"],
      emailNotifications: true,
      autoApproveEvents: false,
      autoApproveOrganizers: false,
    };
    
    // Process settings from database
    for (const record of settingsRecords) {
      let value = record.value;
      
      // Convert to appropriate type
      switch (record.type) {
        case 'number':
          value = Number(value);
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'json':
          value = JSON.parse(value);
          break;
      }
      
      settings[record.key] = value;
    }
    
    // Use defaults for any missing settings
    const finalSettings = { ...defaultSettings, ...settings };

    res.status(200).json({
      success: true,
      settings: finalSettings,
    });
  } catch (error) {
    console.error("Get system settings error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update System Settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const updatedSettings = req.body;
    
    // Update each setting in the database
    for (const [key, value] of Object.entries(updatedSettings)) {
      // Determine the type
      let type = 'string';
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'object') {
        type = 'json';
      }
      
      // Convert value to string for storage
      const stringValue = type === 'json' ? JSON.stringify(value) : String(value);
      
      // Upsert the setting (update if exists, create if not)
      await SystemSetting.upsert({
        key,
        value: stringValue,
        type
      });
    }

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Update system settings error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Create Event Relationship
exports.createEventRelationship = async (req, res) => {
  try {
    const { eventId, relatedEventId, relationshipType, strength } = req.body;
    const adminId = req.user.id;

    // Validate input
    if (!eventId || !relatedEventId) {
      return res.status(400).json({
        success: false,
        message: "Both eventId and relatedEventId are required",
      });
    }

    // Check if both events exist
    const event = await Event.findByPk(eventId);
    const relatedEvent = await Event.findByPk(relatedEventId);

    if (!event || !relatedEvent) {
      return res.status(404).json({
        success: false,
        message: "One or both events not found",
      });
    }

    // Check if a relationship already exists
    const existingRelationship = await EventRelationship.findOne({
      where: {
        eventId,
        relatedEventId,
      },
    });

    if (existingRelationship) {
      // Update existing relationship
      await existingRelationship.update({
        relationshipType: relationshipType || existingRelationship.relationshipType,
        strength: strength || existingRelationship.strength,
      });

      return res.status(200).json({
        success: true,
        message: "Event relationship updated successfully",
        relationship: existingRelationship,
      });
    }

    // Create new relationship
    const relationship = await EventRelationship.create({
      id: uuidv4(),
      eventId,
      relatedEventId,
      relationshipType: relationshipType || "custom",
      strength: strength || 5,
      createdBy: adminId,
    });

    // Create reverse relationship for better recommendations
    await EventRelationship.create({
      id: uuidv4(),
      eventId: relatedEventId,
      relatedEventId: eventId,
      relationshipType: relationshipType || "custom",
      strength: (strength || 5) - 1, // Slightly weaker in reverse
      createdBy: adminId,
    });

    res.status(201).json({
      success: true,
      message: "Event relationship created successfully",
      relationship,
    });
  } catch (error) {
    console.error("Create event relationship error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Event Relationship
exports.deleteEventRelationship = async (req, res) => {
  try {
    const { eventId, relatedEventId } = req.params;

    // Delete the relationship
    const deleted = await EventRelationship.destroy({
      where: {
        eventId,
        relatedEventId,
      },
    });

    // Also delete the reverse relationship if it exists
    await EventRelationship.destroy({
      where: {
        eventId: relatedEventId,
        relatedEventId: eventId,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Event relationship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event relationship deleted successfully",
    });
  } catch (error) {
    console.error("Delete event relationship error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Event Relationships
exports.getEventRelationships = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Get all relationships for this event
    const relationships = await EventRelationship.findAll({
      where: { eventId },
      include: [
        {
          model: Event,
          as: 'RelatedEvent',
          attributes: ['id', 'title', 'eventDate', 'image', 'category'],
        },
      ],
    });

    // Format the relationships
    const formattedRelationships = relationships.map((relationship) => ({
      id: relationship.id,
      eventId: relationship.eventId,
      relatedEventId: relationship.relatedEventId,
      relationshipType: relationship.relationshipType,
      strength: relationship.strength,
      relatedEvent: {
        id: relationship.RelatedEvent.id,
        title: relationship.RelatedEvent.title,
        date: relationship.RelatedEvent.eventDate,
        category: relationship.RelatedEvent.category,
        image: relationship.RelatedEvent.image,
      },
    }));

    res.status(200).json({
      success: true,
      relationships: formattedRelationships,
    });
  } catch (error) {
    console.error("Get event relationships error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
