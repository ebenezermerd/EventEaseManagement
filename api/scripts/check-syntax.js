// scripts/check-syntax.js: runs `node --check` on every source file.
const { execFileSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const files = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".vercel"].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith(".js")) files.push(full)
  }
}
walk(root)

let failed = 0
for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" })
  } catch (error) {
    failed++
    console.error(`FAIL ${path.relative(root, file)}\n${error.stderr}`)
  }
}
console.log(`${files.length - failed}/${files.length} files passed node --check`)
process.exit(failed ? 1 : 0)
