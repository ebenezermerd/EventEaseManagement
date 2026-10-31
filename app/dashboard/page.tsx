import { redirect } from "next/navigation"

// The middleware sends each role to its own dashboard; this is a fallback.
export default function DashboardPage() {
  redirect("/login")
}
