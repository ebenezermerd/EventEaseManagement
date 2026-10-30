// models/eventSchedule.js
const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const Event = require("./event")

const EventSchedule = sequelize.define(
  "EventSchedule",
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
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    day: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "For multi-day events, indicates which day this schedule item is for"
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Determines the display order of schedule items"
    }
  },
  {
    timestamps: true,
    tableName: "event_schedules",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
)

// Establish association with Event model
EventSchedule.belongsTo(Event, { foreignKey: "eventId" })
Event.hasMany(EventSchedule, { foreignKey: "eventId" })

module.exports = EventSchedule
