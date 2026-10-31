"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { api, formatEventDate, type EventItem } from "@/lib/api"

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("upcoming")

  const load = useCallback(() => {
    api<{ events: EventItem[] }>("/api/organizers/events")
      .then((d) => setEvents(d.events))
      .catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const today = new Date(new Date().toDateString())
  const shown = (events ?? []).filter((e) =>
    filter === "all" ? true : filter === "past" ? new Date(e.date) < today : new Date(e.date) >= today,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Events you organize, with live booking counts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizer/events/create">
            <Plus className="mr-2 h-4 w-4" /> Create event
          </Link>
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!events && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}

      {events && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No events here yet.
                    </TableCell>
                  </TableRow>
                )}
                {shown.map((e) => {
                  const capacity = e.ticketTypes.reduce((n, t) => n + t.quantity, 0)
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <p className="font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.category} · {e.price}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatEventDate(e.date)}</TableCell>
                      <TableCell className="hidden max-w-[220px] truncate lg:table-cell">{e.location}</TableCell>
                      <TableCell>
                        {e.attendees}
                        <span className="text-muted-foreground"> / {capacity}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={e.approvalStatus} />
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/organizer/events/${e.id}`}>Manage</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
