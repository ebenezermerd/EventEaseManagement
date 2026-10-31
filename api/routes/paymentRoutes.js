const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")
const { userAuth } = require("../middleware/authMiddleware")

router.get("/payments/methods", paymentController.getPaymentMethods)
router.get("/payments/chapa/callback", paymentController.chapaCallback)
router.post("/payments/chapa/webhook", paymentController.chapaWebhook)
router.get("/payments/verify/:txRef", userAuth, paymentController.verifyPayment)

module.exports = router
