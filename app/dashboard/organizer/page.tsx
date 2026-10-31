"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, CalendarDays, Clock, DollarSign, Loader2, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { useAuth } from "@/contexts/AuthContext"
import { api, formatBirr, formatEventDate, type Booking, type EventItem } from "@/lib/api"

interface DashboardData {
  approvalStatus: "pending" | "approved" | "rejected"
  stats: { totalEvents: number; upcomingEvents: number; ticketsSold: number; revenue: number }
  upcoming: EventItem[]
  recentBookings: Booking[]
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<DashboardData>("/api/organizers/dashboard")
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name.split(" ")[0]}</p>
        </div>
        {data?.approvalStatus === "approved" && (
          <Button asChild>
            <Link href="/dashboard/organizer/events/create">
              <Plus className="mr-2 h-4 w-4" /> Create event
            </Link>
          </Button>
        )}
      </div>

      {data && data.approvalStatus !== "approved" && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <Clock className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold">
                {data.approvalStatus === "pending" ? "Your organizer account is waiting for approval" : "Your organizer application was rejected"}
              </p>
              <p className="text-muted-foreground">
                {data.approvalStatus === "pending"
                  ? "An admin reviews new organizers. You can publish events as soon as you are approved."
                  : "Contact support if you think this is a mistake."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!data && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total events" value={data.stats.totalEvents} icon={Calendar} />
            <StatCard label="Upcoming events" value={data.stats.upcomingEvents} icon={CalendarDays} />
            <StatCard label="Tickets booked" value={data.stats.ticketsSold} icon={Users} />
            <StatCard label="Ticket revenue" value={`ETB ${data.stats.revenue.toLocaleString("en-US")}`} icon={DollarSign} hint="Paid tickets only" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming events</CardTitle>
                <CardDescription>Your next five events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events.</p>}
                {data.upcoming.map((e) => (
                  <Link
                    key={e.id}
                    href={`/dashboard/organizer/events/${e.id}`}
                    className="flex items-center justify-between gap-3 rounded-md border p-3 hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatEventDate(e.date)} · {e.attendees} booked
                      </p>
                    </div>
                    <StatusBadge status={e.approvalStatus} />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent bookings</CardTitle>
                <CardDescription>Latest confirmed tickets across your events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recentBookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
                {data.recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{b.attendee?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.quantity} × {b.ticketType?.name} · {b.event?.title}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/organizer/attendees">All attendees</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
