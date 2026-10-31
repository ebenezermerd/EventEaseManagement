"use client"

import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { EventForm, eventToForm, formToPayload } from "@/components/dashboard/event-form"
import { useAuth } from "@/contexts/AuthContext"
import { api, type EventItem } from "@/lib/api"

export default function CreateEventPage() {
  const router = useRouter()
  const { organizer } = useAuth()

  if (organizer && organizer.approvalStatus !== "approved") {
    return (
      <Card className="max-w-xl">
        <CardContent className="flex items-start gap-3 p-6">
          <Clock className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold">Waiting for approval</p>
            <p className="text-sm text-muted-foreground">You can create events once an admin approves your organizer account.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create event</h1>
        <p className="text-muted-foreground">Events from approved organizers are published straight away.</p>
      </div>
      <EventForm
        initial={eventToForm()}
        withTickets
        submitLabel="Publish event"
        onSubmit={async (values) => {
          try {
            const data = await api<{ event: EventItem; message: string }>("/api/events", {
              method: "POST",
              body: formToPayload(values, true),
            })
            toast({ title: data.message, description: data.event.title })
            router.push(`/dashboard/organizer/events/${data.event.id}`)
          } catch (e) {
            toast({ title: "Could not create event", description: e instanceof Error ? e.message : "", variant: "destructive" })
          }
        }}
      />
    </div>
  )
}
