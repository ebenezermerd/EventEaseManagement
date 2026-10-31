"use client"

import { useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EventItem } from "@/lib/api"

export const CATEGORIES = ["Music", "Technology", "Business", "Arts & Culture", "Food & Drink", "Sports & Fitness", "Education", "Festivals"]
export const REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia",
  "Tigray",
]
export const IMAGES = ["/assets/image (24).jpg", "/assets/image (4).jpg", "/assets/hero-first.jpg", "/assets/image (8).jpg", "/assets/image (9).jpg", "/assets/image (10).jpg", "/assets/image (15).jpg", "/assets/image (18).jpg", "/assets/image (21).jpg", "/assets/image (30).jpg"]

export interface TicketDraft {
  name: string
  price: string
  quantity: string
}

export interface EventFormValues {
  title: string
  description: string
  longDescription: string
  date: string
  time: string
  location: string
  address: string
  region: string
  category: string
  image: string
  ticketTypes: TicketDraft[]
}

export function eventToForm(event?: EventItem): EventFormValues {
  return {
    title: event?.title ?? "",
    description: event?.description ?? "",
    longDescription: event?.longDescription ?? "",
    date: event ? new Date(event.date).toISOString().slice(0, 10) : "",
    time: event?.time ?? "",
    location: event?.location ?? "",
    address: event?.address ?? "",
    region: event?.region ?? "Addis Ababa",
    category: event?.category ?? "Technology",
    image: event?.image ?? IMAGES[0],
    ticketTypes: [{ name: "General admission", price: "0", quantity: "100" }],
  }
}

const selectClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

export function EventForm({
  initial,
  withTickets,
  submitLabel,
  onSubmit,
}: {
  initial: EventFormValues
  withTickets: boolean
  submitLabel: string
  onSubmit: (values: EventFormValues) => Promise<void>
}) {
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const set = (key: keyof EventFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))
  const setTicket = (i: number, key: keyof TicketDraft, value: string) =>
    setValues((v) => ({ ...v, ticketTypes: v.ticketTypes.map((t, j) => (j === i ? { ...t, [key]: value } : t)) }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(values)
    } finally {
      setSaving(false)
    }
  }

  const minDate = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
          <CardDescription>What attendees see on the event page</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={values.title} onChange={set("title")} required minLength={3} maxLength={150} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Short description</Label>
            <Textarea id="description" value={values.description} onChange={set("description")} required minLength={10} maxLength={1000} rows={2} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="longDescription">Full description (optional)</Label>
            <Textarea id="longDescription" value={values.longDescription} onChange={set("longDescription")} rows={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" className={selectClass} value={values.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Cover image</Label>
            <select id="image" className={selectClass} value={values.image} onChange={set("image")}>
              {IMAGES.map((src, i) => (
                <option key={src} value={src}>
                  Stock photo {i + 1}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date and place</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" min={minDate} value={values.date} onChange={set("date")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" placeholder="9:00 AM to 5:00 PM" value={values.time} onChange={set("time")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Venue</Label>
            <Input id="location" placeholder="Millennium Hall, Addis Ababa" value={values.location} onChange={set("location")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <select id="region" className={selectClass} value={values.region} onChange={set("region")}>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Bole Road, Addis Ababa" value={values.address} onChange={set("address")} required />
          </div>
        </CardContent>
      </Card>

      {withTickets && (
        <Card>
          <CardHeader>
            <CardTitle>Tickets</CardTitle>
            <CardDescription>
              Set the price to 0 for free tickets. Paid tickets are listed but checkout stays in test mode until Chapa is connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {values.ticketTypes.map((t, i) => (
              <div key={i} className="grid grid-cols-[1fr_110px_110px_auto] items-end gap-2">
                <div className="space-y-1">
                  {i === 0 && <Label>Name</Label>}
                  <Input value={t.name} onChange={(e) => setTicket(i, "name", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  {i === 0 && <Label>Price (ETB)</Label>}
                  <Input type="number" min={0} value={t.price} onChange={(e) => setTicket(i, "price", e.target.value)} required />
                </div>
                <div className="space-y-1">
                  {i === 0 && <Label>Quantity</Label>}
                  <Input type="number" min={1} value={t.quantity} onChange={(e) => setTicket(i, "quantity", e.target.value)} required />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={values.ticketTypes.length === 1}
                  onClick={() => setValues((v) => ({ ...v, ticketTypes: v.ticketTypes.filter((_, j) => j !== i) }))}
                  aria-label="Remove ticket type"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValues((v) => ({ ...v, ticketTypes: [...v.ticketTypes, { name: "", price: "0", quantity: "50" }] }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add ticket type
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function formToPayload(values: EventFormValues, withTickets: boolean) {
  const payload: Record<string, unknown> = {
    title: values.title,
    description: values.description,
    date: values.date,
    time: values.time,
    location: values.location,
    address: values.address,
    region: values.region,
    category: values.category,
    image: values.image,
  }
  if (values.longDescription) payload.longDescription = values.longDescription
  if (withTickets) {
    payload.ticketTypes = values.ticketTypes.map((t) => ({ name: t.name, price: Number(t.price), quantity: Number(t.quantity) }))
  }
  return payload
}
