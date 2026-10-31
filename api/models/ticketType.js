// models/ticketType.js
const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const Event = require("./event")

const TicketType = sequelize.define(
  "TicketType",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const value = this.getDataValue("price")
        return value === null || value === undefined ? 0 : Number(value)
      },
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "ETB",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    requirements: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salesStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salesEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "ticket_types",
  }
)

// Establish association with Event model
TicketType.belongsTo(Event, { foreignKey: "eventId" })
Event.hasMany(TicketType, { foreignKey: "eventId" })

module.exports = TicketType
