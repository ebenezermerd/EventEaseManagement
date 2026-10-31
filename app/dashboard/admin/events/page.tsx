"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { api, formatEventDate, type EventItem } from "@/lib/api"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    const qs = new URLSearchParams({ status, limit: "100" })
    if (search) qs.set("search", search)
    api<{ events: EventItem[] }>(`/api/admin/events?${qs}`)
      .then((d) => setEvents(d.events))
      .catch((e) => setError(e.message))
  }, [search, status])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const setEventStatus = async (e: EventItem, next: "approved" | "rejected") => {
    let reason: string | undefined
    if (next === "rejected") {
      reason = window.prompt(`Why is "${e.title}" unpublished?`) || undefined
      if (!reason) return
    }
    try {
      await api(`/api/admin/events/${e.id}/status`, { method: "PUT", body: { status: next, reason } })
      toast({ title: next === "approved" ? "Event published" : "Event unpublished", description: e.title })
      load()
    } catch (err) {
      toast({ title: "Update failed", description: err instanceof Error ? err.message : "", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">Every event on the platform, with moderation</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search title or venue" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-48" aria-label="Status">
          <option value="all">All statuses</option>
          <option value="approved">Published</option>
          <option value="pending">Pending</option>
          <option value="rejected">Unpublished</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!events && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
      {events && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden md:table-cell">Organizer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No events found.</TableCell>
                  </TableRow>
                )}
                {events.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <Link href={`/events/${e.id}`} className="font-medium hover:underline">{e.title}</Link>
                      <p className="text-xs text-muted-foreground">{e.category} · {e.region}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{e.organizer?.companyName}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatEventDate(e.date)}</TableCell>
                    <TableCell>{e.attendees}</TableCell>
                    <TableCell><StatusBadge status={e.approvalStatus} /></TableCell>
                    <TableCell className="text-right">
                      {e.approvalStatus === "approved" ? (
                        <Button size="sm" variant="outline" onClick={() => setEventStatus(e, "rejected")}>Unpublish</Button>
                      ) : e.approvalStatus !== "cancelled" ? (
                        <Button size="sm" onClick={() => setEventStatus(e, "approved")}>Publish</Button>
                      ) : null}
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
