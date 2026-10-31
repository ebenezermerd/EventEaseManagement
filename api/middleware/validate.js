// middleware/validate.js
// Validates req.body against a Joi schema and replaces it with the cleaned value.
const validate = (schema) => (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {}
  const { error, value } = schema.validate(body, { abortEarly: false, allowUnknown: true, stripUnknown: false })
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message.replace(/"/g, "")).join(", "),
    })
  }
  req.body = value
  next()
}

module.exports = validate
