import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Users, MapPin, Filter, Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdvancedPagination } from "@/components/advanced-pagination"
import { mockEvents } from "@/lib/mock-data"

export default function EventsPage({ searchParams }: { searchParams: { page?: string; size?: string } }) {
  // Parse query parameters with defaults
  const currentPage = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.size) || 6

  // Use centralized mock events data
  const events = mockEvents.filter(event => event.status === 'published')

  // Calculate pagination
  const totalEvents = events.length
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedEvents = events.slice(startIndex, endIndex)

  return (
    <>
      <SiteHeader />
      <main className="container py-10 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Events</h1>
          <p className="text-muted-foreground max-w-3xl mb-6">
            Find and book events across Ethiopia. From tech conferences to cultural exhibitions, we've got something for
            everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-end">
            <div>
              <Input placeholder="Search events..." />
            </div>
            <Select defaultValue="category">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="date">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Any Date</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="weekend">This Weekend</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="group overflow-hidden border hover:border-primary/20 transition-colors">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge className="bg-primary/80 hover:bg-primary">{event.category}</Badge>
                    {event.featured && (
                      <Badge variant="secondary" className="bg-yellow-500/80 hover:bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary/70" />
                      <span>
                        {event.eventDate} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      {event.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{event.rating}</span>
                          <span className="text-xs ml-1">({event.reviewCount})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div>
                      <span className="font-semibold text-lg text-primary">{event.price}</span>
                    </div>
                    <Button className="text-xs" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <AdvancedPagination
            totalItems={totalEvents}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            siblingsCount={1}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
