// config/database.js
// A single Sequelize instance shared by every model. Postgres (Neon in
// production, any local Postgres in development) via DATABASE_URL.
const { Sequelize } = require("sequelize")
const pg = require("pg")
const config = require("./config")

if (!config.DATABASE_URL) {
  console.warn("[database] DATABASE_URL is not set; queries will fail until it is configured")
}

const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(config.DATABASE_URL)

// Reuse one instance across warm invocations of the serverless function.
const sequelize =
  global.__eventeaseSequelize ||
  new Sequelize(config.DATABASE_URL || "postgres://localhost:5432/eventease", {
    dialect: "postgres",
    dialectModule: pg,
    logging: process.env.SQL_LOG === "1" ? console.log : false,
    dialectOptions: isLocal ? {} : { ssl: { require: true, rejectUnauthorized: false } },
    pool: { max: 3, min: 0, acquire: 20000, idle: 5000, evict: 5000 },
    define: { freezeTableName: true },
  })

global.__eventeaseSequelize = sequelize

module.exports = sequelize
