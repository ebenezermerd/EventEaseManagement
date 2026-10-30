import { redirect } from "next/navigation"

// Organizer sign up lives on the main registration page.
export default function OrganizerRegisterPage() {
  redirect("/register?type=organizer")
}
