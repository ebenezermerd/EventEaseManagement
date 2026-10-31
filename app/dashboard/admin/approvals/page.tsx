import { OrganizerTable } from "@/components/dashboard/organizer-table"

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organizer Approvals</h1>
        <p className="text-muted-foreground">Approve organizers so they can publish events on EventEase</p>
      </div>
      <OrganizerTable status="pending" />
    </div>
  )
}
