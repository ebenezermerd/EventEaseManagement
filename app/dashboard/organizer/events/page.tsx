import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EventsPage() {
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted">
              <img
                src={`/placeholder.svg?height=200&width=400&text=Event+${i}`}
                alt={`Event ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Event {i}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>May {10 + i}, 2024</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Link href={`/dashboard/organizer/events/${i}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                </Link>
                <Button variant="outline" size="sm">
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
