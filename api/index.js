// index.js: Vercel imports this module and serves the exported app on
// Fluid Compute; running `node index.js` locally starts a normal server.
const app = require("./app")
const { PORT } = require("./config/config")

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`EventEase API listening on http://localhost:${PORT}`))
}

module.exports = app
