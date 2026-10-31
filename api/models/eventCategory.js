const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const Event = require("./event")

const EventCategory = sequelize.define(
  "EventCategory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      references: {
        model: Event,
        key: "id",
      },
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true,
    tableName: "event_categories",
  },
)
module.exports = EventCategory 