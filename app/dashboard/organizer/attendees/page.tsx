"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Download, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { api, formatBirr, formatEventDate, type Booking, type EventItem } from "@/lib/api"

export default function OrganizerAttendeesPage() {
  const [attendees, setAttendees] = useState<Booking[] | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventId, setEventId] = useState("all")
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    const qs = eventId === "all" ? "" : `?eventId=${eventId}`
    api<{ attendees: Booking[] }>(`/api/organizers/attendees${qs}`)
      .then((d) => setAttendees(d.attendees))
      .catch((e) => setError(e.message))
  }, [eventId])

  useEffect(load, [load])
  useEffect(() => {
    api<{ events: EventItem[] }>("/api/organizers/events")
      .then((d) => setEvents(d.events))
      .catch(() => {})
  }, [])

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (attendees ?? []).filter(
      (b) => !q || b.attendee?.name.toLowerCase().includes(q) || b.attendee?.email.toLowerCase().includes(q) || b.bookingReference.toLowerCase().includes(q),
    )
  }, [attendees, search])

  const checkIn = async (b: Booking) => {
    try {
      await api(`/api/organizer/bookings/${b.id}/check-in`, { method: "PUT" })
      toast({ title: "Checked in", description: b.attendee?.name })
      load()
    } catch (e) {
      toast({ title: "Could not check in", description: e instanceof Error ? e.message : "", variant: "destructive" })
    }
  }

  const exportCsv = () => {
    const rows = [["Name", "Email", "Event", "Ticket", "Quantity", "Reference", "Status"]]
    for (const b of shown) {
      rows.push([b.attendee?.name || "", b.attendee?.email || "", b.event?.title || "", b.ticketType?.name || "", String(b.quantity), b.bookingReference, b.status])
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "attendees.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendees</h1>
          <p className="text-muted-foreground">Everyone who booked your events</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!shown.length}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, email or reference" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-72"
          aria-label="Filter by event"
        >
          <option value="all">All events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!attendees && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}

      {attendees && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead className="hidden md:table-cell">Event</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead className="hidden sm:table-cell">Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Check in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No attendees yet.
                    </TableCell>
                  </TableRow>
                )}
                {shown.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium">{b.attendee?.name}</p>
                      <p className="text-xs text-muted-foreground">{b.attendee?.email}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="max-w-[240px] truncate">{b.event?.title}</p>
                      <p className="text-xs text-muted-foreground">{b.event && formatEventDate(b.event.date)}</p>
                    </TableCell>
                    <TableCell>
                      {b.quantity} × {b.ticketType?.name}
                      <p className="text-xs text-muted-foreground">{formatBirr(b.totalPrice)}</p>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs sm:table-cell">{b.bookingReference}</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status === "confirmed" && (
                        <Button size="sm" variant="outline" onClick={() => checkIn(b)}>
                          Check in
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
