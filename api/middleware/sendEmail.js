// middleware/sendEmail.js
// Sends mail only when SMTP settings exist; otherwise logs the message so
// flows that "send an email" keep working on demo deployments.
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = require("../config/config")

const sendEmail = async (to, subject, text) => {
  if (!EMAIL_HOST || !EMAIL_USER) {
    console.log(`[email disabled] to=${to} subject="${subject}"`)
    return { success: true, skipped: true, message: "Email sending is disabled on this deployment" }
  }
  try {
    // Loaded lazily so the dependency is only needed when email is configured.
    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, text })
    return { success: true, message: "Email sent" }
  } catch (error) {
    console.error("Error sending email:", error.message)
    return { success: false, error: error.message }
  }
}

module.exports = sendEmail
