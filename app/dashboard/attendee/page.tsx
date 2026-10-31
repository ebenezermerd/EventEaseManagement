"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Loader2, MapPin, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { StatusBadge } from "@/components/dashboard/status-badge"
import { useAuth } from "@/contexts/AuthContext"
import { api, formatBirr, formatEventDate, imageSrc, type Booking } from "@/lib/api"

export default function AttendeeDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await api<{ bookings: Booking[] }>("/api/user/bookings")
      setBookings(data.bookings)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings")
    }
  }, [])

  useEffect(() => {
    // Returning from Chapa checkout: confirm the payment, then show bookings.
    const reference = new URLSearchParams(window.location.search).get("payment")
    if (!reference) {
      load()
      return
    }
    api<{ success: boolean; reason?: string }>(`/api/payments/verify/${encodeURIComponent(reference)}`)
      .then((r) =>
        toast(
          r.success
            ? { title: "Payment received", description: "Your booking is confirmed." }
            : { title: "Payment not confirmed yet", description: "If you completed checkout, refresh in a moment." },
        ),
      )
      .catch(() => {})
      .finally(() => {
        window.history.replaceState(null, "", "/dashboard/attendee")
        load()
      })
  }, [load])

  const cancel = async (booking: Booking) => {
    try {
      await api(`/api/user/bookings/${booking.id}/cancel`, { method: "PUT" })
      toast({ title: "Booking cancelled", description: booking.event?.title })
      load()
    } catch (e) {
      toast({ title: "Could not cancel", description: e instanceof Error ? e.message : "", variant: "destructive" })
    }
  }

  const now = new Date(new Date().toDateString())
  const upcoming = (bookings ?? []).filter((b) => b.event && new Date(b.event.date) >= now && b.status !== "cancelled")
  const other = (bookings ?? []).filter((b) => !upcoming.includes(b))

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hi {user?.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground">Your tickets and bookings</p>
        </div>
        <Button asChild>
          <Link href="/events">Find events</Link>
        </Button>
      </div>

      {error && <p className="rounded-md border border-destructive/40 p-4 text-sm text-destructive">{error}</p>}
      {!bookings && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}

      {bookings && bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <Ticket className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground">Free events can be booked in one click.</p>
            <Button asChild variant="outline">
              <Link href="/events">Browse upcoming events</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          {upcoming.map((b) => (
            <BookingRow key={b.id} booking={b} onCancel={() => cancel(b)} />
          ))}
        </section>
      )}
      {other.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Past and cancelled</h2>
          {other.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </section>
      )}
    </div>
  )
}

function BookingRow({ booking, onCancel }: { booking: Booking; onCancel?: () => void }) {
  const event = booking.event
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-md sm:w-32">
          <Image src={imageSrc(event?.image)} alt={event?.title || "Event"} fill className="object-cover" sizes="128px" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/events/${event?.id}`} className="font-semibold hover:underline">
              {event?.title}
            </Link>
            <StatusBadge status={booking.status} />
          </div>
          {event && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {formatEventDate(event.date)} · {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {event.location}
              </span>
            </p>
          )}
          <p className="text-sm">
            {booking.quantity} × {booking.ticketType?.name} · {formatBirr(booking.totalPrice)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
          <span className="rounded bg-muted px-2 py-1 font-mono text-sm">{booking.bookingReference}</span>
          {onCancel && booking.status === "confirmed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your {booking.quantity} ticket(s) for {event?.title} will be released.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel}>Cancel booking</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
