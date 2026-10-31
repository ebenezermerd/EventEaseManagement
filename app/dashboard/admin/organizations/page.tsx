import { OrganizerTable } from "@/components/dashboard/organizer-table"

export default function AdminOrganizationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organizers</h1>
        <p className="text-muted-foreground">Every organizer account and its approval status</p>
      </div>
      <OrganizerTable status="all" />
    </div>
  )
}
