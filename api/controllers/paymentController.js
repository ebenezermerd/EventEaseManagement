// controllers/paymentController.js
// Chapa checkout for paid tickets. Everything here is inert unless
// CHAPA_SECRET_KEY is configured; free bookings never touch this file.
const chapa = require("../services/chapa")
const { settlePayment } = require("./bookingController")
const { FRONTEND_URL } = require("../config/config")

// GET /api/payments/methods
exports.getPaymentMethods = async (req, res) => {
  res.status(200).json({
    success: true,
    paidCheckoutEnabled: chapa.isEnabled(),
    methods: chapa.isEnabled() ? [{ id: "chapa", name: "Chapa (test mode)" }] : [],
    message: chapa.isEnabled() ? undefined : "Paid checkout is in test mode and coming soon",
  })
}

// GET /api/payments/chapa/callback?trx_ref=...: Chapa calls this after checkout.
exports.chapaCallback = async (req, res) => {
  const txRef = req.query.trx_ref || req.query.tx_ref
  try {
    const result = await settlePayment(txRef)
    res.status(result.ok ? 200 : 400).json({ success: result.ok, reason: result.reason })
  } catch (error) {
    console.error("[chapa] callback failed:", error.message)
    res.status(500).json({ success: false })
  }
}

// POST /api/payments/chapa/webhook: never trusts the payload, re-verifies with Chapa.
exports.chapaWebhook = async (req, res) => {
  const txRef = req.body?.tx_ref || req.body?.trx_ref
  try {
    const result = await settlePayment(txRef)
    res.status(200).json({ received: true, confirmed: result.ok })
  } catch (error) {
    console.error("[chapa] webhook failed:", error.message)
    res.status(200).json({ received: true, confirmed: false })
  }
}

// GET /api/payments/verify/:txRef: lets the attendee page confirm on return.
exports.verifyPayment = async (req, res, next) => {
  try {
    const result = await settlePayment(req.params.txRef)
    res.status(200).json({ success: result.ok, reason: result.reason, redirect: `${FRONTEND_URL}/dashboard/attendee` })
  } catch (error) {
    next(error)
  }
}
