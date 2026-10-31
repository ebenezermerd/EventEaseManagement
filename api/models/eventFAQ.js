// models/eventFAQ.js
const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const Event = require("./event")

const EventFAQ = sequelize.define(
  "EventFAQ",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Determines the display order of FAQs"
    }
  },
  {
    timestamps: true,
    tableName: "event_faqs",
  }
)

// Establish association with Event model
EventFAQ.belongsTo(Event, { foreignKey: "eventId" })
Event.hasMany(EventFAQ, { foreignKey: "eventId" })

module.exports = EventFAQ
