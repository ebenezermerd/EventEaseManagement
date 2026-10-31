"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, Minus, Plus, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { api, ApiError, formatBirr, type Booking, type EventItem } from "@/lib/api"

export function BookingPanel({ event }: { event: EventItem }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const firstAvailable = event.ticketTypes.find((t) => t.available)
  const [ticketId, setTicketId] = useState(firstAvailable?.id ?? "")
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  const ticket = event.ticketTypes.find((t) => t.id === ticketId)
  const isPast = new Date(event.date) < new Date(new Date().toDateString())
  const max = Math.min(10, ticket?.remaining ?? 0)
  const total = (ticket?.price ?? 0) * quantity

  const book = async () => {
    if (!ticket) return
    setSubmitting(true)
    try {
      const data = await api<{ booking?: Booking; checkoutUrl?: string }>("/api/user/bookings", {
        method: "POST",
        body: { eventId: event.id, ticketTypeId: ticket.id, quantity },
      })
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }
      setBooking(data.booking ?? null)
      toast({ title: "Booking confirmed", description: `Reference ${data.booking?.bookingReference}` })
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Booking failed"
      toast({
        title: error instanceof ApiError && error.code === "PAYMENTS_DISABLED" ? "Paid tickets coming soon" : "Could not book",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (booking) {
    return (
      <Card className="border-green-500/40">
        <CardContent className="space-y-4 pt-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
          <div>
            <p className="text-lg font-semibold">You are going!</p>
            <p className="text-sm text-muted-foreground">
              {booking.quantity} × {booking.ticketType?.name}
            </p>
          </div>
          <p className="rounded-md bg-muted p-3 font-mono text-lg tracking-wider">{booking.bookingReference}</p>
          <p className="text-xs text-muted-foreground">Show this reference at the entrance.</p>
          <Button asChild className="w-full">
            <Link href="/dashboard/attendee">View my bookings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ticket className="h-5 w-5 text-primary" />
          Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.ticketTypes.length === 0 && <p className="text-sm text-muted-foreground">No tickets are on sale.</p>}
        <div className="space-y-2">
          {event.ticketTypes.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3 text-sm transition-colors ${
                t.id === ticketId ? "border-primary bg-primary/5" : "hover:bg-muted"
              } ${!t.available ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="ticket"
                  value={t.id}
                  checked={t.id === ticketId}
                  disabled={!t.available}
                  onChange={() => {
                    setTicketId(t.id)
                    setQuantity(1)
                  }}
                  className="accent-primary"
                />
                <span>
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.available ? `${t.remaining} left` : "Sold out"}
                  </span>
                </span>
              </span>
              <span className="font-semibold">{formatBirr(t.price)}</span>
            </label>
          ))}
        </div>

        {ticket && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Fewer tickets"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                aria-label="More tickets"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-primary">{formatBirr(total)}</span>
        </div>

        {isPast ? (
          <Button disabled className="w-full">
            This event has ended
          </Button>
        ) : loading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </Button>
        ) : !user ? (
          <Button asChild className="w-full">
            <Link href={`/login?next=/events/${event.id}`}>Sign in to book</Link>
          </Button>
        ) : user.role !== "attendee" ? (
          <p className="rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
            Sign in with an attendee account to book tickets.
          </p>
        ) : (
          <Button className="w-full" disabled={!ticket || submitting} onClick={book}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {total > 0 ? "Checkout" : "Book free ticket"}
          </Button>
        )}
        {ticket && ticket.price > 0 && (
          <p className="text-center text-xs text-muted-foreground">Paid checkout runs in Chapa test mode and is coming soon.</p>
        )}
      </CardContent>
    </Card>
  )
}
