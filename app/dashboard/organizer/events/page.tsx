import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, Filter, Users, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { mockEvents, getEventsByOrganizer } from "@/lib/mock-data"

export default function EventsPage() {
  // In a real app, this would come from the logged-in user's organizer ID
  const organizerId = 'org_001'
  const organizerEvents = getEventsByOrganizer(organizerId)
  
  // Fallback to mock events if no organizer events found
  const events = organizerEvents.length > 0 ? organizerEvents : mockEvents.slice(0, 6)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Manage your events and create new ones</p>
        </div>
        <Link href="/dashboard/organizer/events/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="h-48 bg-muted relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 right-3" variant={
                event.status === 'published' ? 'default' : 
                event.status === 'draft' ? 'secondary' : 
                'destructive'
              }>
                {event.status}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{event.eventDate}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.attendees} attendees</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">ETB {event.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Link href={`/dashboard/organizer/events/${event.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
