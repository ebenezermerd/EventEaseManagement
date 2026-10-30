// models/eventTemplate.js
const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./user")

const EventTemplate = sequelize.define(
  "EventTemplate",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    eventType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    templateData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "event_templates",
  },
)

// Establish association with User model
EventTemplate.belongsTo(User, { foreignKey: "userId" })
User.hasMany(EventTemplate, { foreignKey: "userId" })

module.exports = EventTemplate
