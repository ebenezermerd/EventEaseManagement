// services/chapa.js
// Minimal Chapa client. Paid checkout is only enabled when CHAPA_SECRET_KEY
// is set (use a Chapa *test* secret key for demo deployments).
const axios = require("axios")
const { CHAPA_SECRET_KEY } = require("../config/config")

const BASE_URL = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1"

const isEnabled = () => Boolean(CHAPA_SECRET_KEY)

const client = () =>
  axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}`, "Content-Type": "application/json" },
  })

// Returns the hosted checkout URL for a transaction.
async function initializeTransaction({ amount, email, firstName, lastName, txRef, callbackUrl, returnUrl, title }) {
  const { data } = await client().post("/transaction/initialize", {
    amount: String(amount),
    currency: "ETB",
    email,
    first_name: firstName,
    last_name: lastName,
    tx_ref: txRef,
    callback_url: callbackUrl,
    return_url: returnUrl,
    customization: { title: "EventEase", description: String(title).slice(0, 50) },
  })
  if (data?.status !== "success" || !data?.data?.checkout_url) {
    throw new Error(data?.message || "Chapa did not return a checkout URL")
  }
  return data.data.checkout_url
}

// True when Chapa reports the transaction as paid.
async function verifyTransaction(txRef) {
  const { data } = await client().get(`/transaction/verify/${encodeURIComponent(txRef)}`)
  return data?.status === "success" && data?.data?.status === "success"
}

module.exports = { isEnabled, initializeTransaction, verifyTransaction }
