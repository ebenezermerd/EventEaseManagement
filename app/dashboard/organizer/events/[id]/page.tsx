"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { EventForm, eventToForm, formToPayload } from "@/components/dashboard/event-form"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { api, formatBirr, formatEventDate, type Booking, type EventItem } from "@/lib/api"

export default function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [attendees, setAttendees] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null)
  const [newTicket, setNewTicket] = useState({ name: "", price: "0", quantity: "50" })

  const load = useCallback(async () => {
    try {
      const [ev, att] = await Promise.all([
        api<{ event: EventItem }>(`/api/events/${id}`),
        api<{ attendees: Booking[] }>(`/api/organizers/events/${id}/attendees`),
      ])
      setEvent(ev.event)
      setAttendees(att.attendees)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load event")
    }
  }, [id])
  useEffect(() => {
    load()
  }, [load])

  const fail = (title: string, e: unknown) =>
    toast({ title, description: e instanceof Error ? e.message : "", variant: "destructive" })

  const addTicket = async () => {
    try {
      await api(`/api/organizer/events/${id}/ticket-types`, {
        method: "POST",
        body: { name: newTicket.name, price: Number(newTicket.price), quantity: Number(newTicket.quantity) },
      })
      setNewTicket({ name: "", price: "0", quantity: "50" })
      toast({ title: "Ticket type added" })
      load()
    } catch (e) {
      fail("Could not add ticket type", e)
    }
  }

  const closeTicket = async (ticketId: string) => {
    try {
      const data = await api<{ message: string }>(`/api/organizer/ticket-types/${ticketId}`, { method: "DELETE" })
      toast({ title: data.message })
      load()
    } catch (e) {
      fail("Could not remove ticket type", e)
    }
  }

  const removeEvent = async () => {
    try {
      const data = await api<{ message: string }>(`/api/events/${id}`, { method: "DELETE" })
      toast({ title: data.message })
      router.push("/dashboard/organizer/events")
    } catch (e) {
      fail("Could not delete event", e)
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (!event) return <Loader2 className="h-6 w-6 animate-spin text-primary" />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <StatusBadge status={event.approvalStatus} />
          </div>
          <p className="text-muted-foreground">
            {formatEventDate(event.date)} · {event.location} · {event.attendees} booked
          </p>
        </div>
        <div className="flex gap-2">
          {event.approvalStatus === "approved" && (
            <Button asChild variant="outline">
              <Link href={`/events/${event.id}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" /> View public page
              </Link>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                <AlertDialogDescription>
                  Events that already have bookings are cancelled instead of deleted so attendees keep their records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep event</AlertDialogCancel>
                <AlertDialogAction onClick={removeEvent}>Delete event</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="attendees">
        <TabsList>
          <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="details">Edit details</TabsTrigger>
        </TabsList>

        <TabsContent value="attendees">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead className="hidden sm:table-cell">Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No bookings yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {attendees.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <p className="font-medium">{b.attendee?.name}</p>
                        <p className="text-xs text-muted-foreground">{b.attendee?.email}</p>
                      </TableCell>
                      <TableCell>
                        {b.quantity} × {b.ticketType?.name}
                      </TableCell>
                      <TableCell className="hidden font-mono text-xs sm:table-cell">{b.bookingReference}</TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket types</CardTitle>
              <CardDescription>Ticket types with bookings are closed instead of deleted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {event.ticketTypes.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {t.name} {!t.available && <span className="text-xs text-muted-foreground">(sales closed)</span>}
                    </p>
                    <p className="text-muted-foreground">
                      {formatBirr(t.price)} · {t.sold} of {t.quantity} booked
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => closeTicket(t.id)} disabled={!t.available && t.sold > 0}>
                    Remove
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_100px_100px_auto] items-end gap-2 pt-2">
                <Input placeholder="New ticket name" value={newTicket.name} onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })} />
                <Input type="number" min={0} aria-label="Price" value={newTicket.price} onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })} />
                <Input type="number" min={1} aria-label="Quantity" value={newTicket.quantity} onChange={(e) => setNewTicket({ ...newTicket, quantity: e.target.value })} />
                <Button onClick={addTicket} disabled={!newTicket.name}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <EventForm
            initial={eventToForm(event)}
            withTickets={false}
            submitLabel="Save changes"
            onSubmit={async (values) => {
              try {
                const data = await api<{ event: EventItem }>(`/api/events/${id}`, {
                  method: "PUT",
                  body: formToPayload(values, false),
                })
                setEvent((prev) => (prev ? { ...prev, ...data.event } : data.event))
                toast({ title: "Event updated" })
              } catch (e) {
                fail("Could not save", e)
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
