// controllers/categoryController.js
const { Op } = require("sequelize")
const sequelize = require("../config/database")
const { Category, Event } = require("../models/association")

// Event counts per category name for upcoming approved events.
async function countsByName() {
  const rows = await Event.findAll({
    attributes: ["category", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    where: { approvalStatus: "approved", eventDate: { [Op.gte]: new Date() } },
    group: ["category"],
    raw: true,
  })
  return Object.fromEntries(rows.map((r) => [String(r.category).toLowerCase(), Number(r.count)]))
}

const formatCategory = (c, counts) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  icon: c.icon,
  eventCount: counts[c.name.toLowerCase()] || 0,
})

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const [categories, counts] = await Promise.all([Category.findAll({ order: [["name", "ASC"]] }), countsByName()])
    res.status(200).json({ success: true, categories: categories.map((c) => formatCategory(c, counts)) })
  } catch (error) {
    next(error)
  }
}

// GET /api/categories/:id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id).catch(() => null)
    if (!category) return res.status(404).json({ success: false, message: "Category not found" })
    res.status(200).json({ success: true, category: formatCategory(category, await countsByName()) })
  } catch (error) {
    next(error)
  }
}

// GET /api/categories/slug/:slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } })
    if (!category) return res.status(404).json({ success: false, message: "Category not found" })
    res.status(200).json({ success: true, category: formatCategory(category, await countsByName()) })
  } catch (error) {
    next(error)
  }
}
