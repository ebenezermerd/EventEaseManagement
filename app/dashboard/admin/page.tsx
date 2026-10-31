"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building, Calendar, CalendarDays, CheckCircle2, DollarSign, Loader2, Ticket, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { api, formatBirr } from "@/lib/api"

interface Stats {
  users: number
  attendees: number
  organizers: number
  pendingOrganizers: number
  events: number
  upcomingEvents: number
  bookings: number
  ticketsSold: number
  revenue: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<{ stats: Stats }>("/api/admin/dashboard")
      .then((d) => setStats(d.stats))
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Live platform totals</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!stats && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}

      {stats && (
        <>
          {stats.pendingOrganizers > 0 && (
            <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <p className="text-sm">
                  <span className="font-semibold">{stats.pendingOrganizers} organizer application(s)</span> waiting for review.
                </p>
                <Button asChild size="sm">
                  <Link href="/dashboard/admin/approvals">Review now</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={stats.users} icon={Users} hint={`${stats.attendees} attendees`} />
            <StatCard label="Approved organizers" value={stats.organizers} icon={Building} />
            <StatCard label="Pending organizers" value={stats.pendingOrganizers} icon={CheckCircle2} />
            <StatCard label="Events" value={stats.events} icon={Calendar} hint={`${stats.upcomingEvents} upcoming`} />
            <StatCard label="Bookings" value={stats.bookings} icon={CalendarDays} />
            <StatCard label="Tickets booked" value={stats.ticketsSold} icon={Ticket} />
            <StatCard label="Ticket revenue" value={formatBirr(stats.revenue)} icon={DollarSign} hint="Paid tickets only" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Shortcuts</CardTitle>
              <CardDescription>Moderation tools</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link href="/dashboard/admin/approvals">Organizer approvals</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/admin/users">Users</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/admin/organizations">Organizers</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/admin/events">Events</Link></Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
