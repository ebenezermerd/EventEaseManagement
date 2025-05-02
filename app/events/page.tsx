import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Users, MapPin, Filter } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdvancedPagination } from "@/components/advanced-pagination"

export default function EventsPage({ searchParams }: { searchParams: { page?: string; size?: string } }) {
  // Parse query parameters with defaults
  const currentPage = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.size) || 6

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Addis Tech Summit 2024",
      date: "May 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Millennium Hall, Addis Ababa",
      price: "ETB 500",
      category: "Technology",
      attendees: 320,
      image: "/placeholder.svg?height=300&width=500&text=Addis+Tech+Summit",
    },
    {
      id: 2,
      title: "Ethiopian Coffee Festival",
      date: "May 22, 2024",
      time: "10:00 AM - 8:00 PM",
      location: "Friendship Park, Addis Ababa",
      price: "ETB 300",
      category: "Cultural",
      attendees: 150,
      image: "/placeholder.svg?height=300&width=500&text=Coffee+Festival",
    },
    {
      id: 3,
      title: "Cultural Heritage Exhibition",
      date: "May 28, 2024",
      time: "2:00 PM - 7:00 PM",
      location: "National Museum, Addis Ababa",
      price: "ETB 200",
      category: "Cultural",
      attendees: 75,
      image: "/placeholder.svg?height=300&width=500&text=Cultural+Exhibition",
    },
    {
      id: 4,
      title: "Business Networking Mixer",
      date: "June 5, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Hyatt Regency, Addis Ababa",
      price: "ETB 1000",
      category: "Business",
      attendees: 200,
      image: "/placeholder.svg?height=300&width=500&text=Business+Mixer",
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      date: "June 12, 2024",
      time: "1:00 PM - 5:00 PM",
      location: "iceaddis, Addis Ababa",
      price: "ETB 250",
      category: "Business",
      attendees: 120,
      image: "/placeholder.svg?height=300&width=500&text=Startup+Pitch",
    },
    {
      id: 6,
      title: "Addis Fashion Week",
      date: "June 20, 2024",
      time: "4:00 PM - 10:00 PM",
      location: "Sheraton Addis, Addis Ababa",
      price: "ETB 800",
      category: "Fashion",
      attendees: 400,
      image: "/placeholder.svg?height=300&width=500&text=Fashion+Week",
    },
    {
      id: 7,
      title: "Ethiopian Film Festival",
      date: "July 5, 2024",
      time: "12:00 PM - 10:00 PM",
      location: "Vamdas Entertainment Center, Addis Ababa",
      price: "ETB 350",
      category: "Entertainment",
      attendees: 280,
      image: "/placeholder.svg?height=300&width=500&text=Film+Festival",
    },
    {
      id: 8,
      title: "Addis Ababa Marathon",
      date: "July 15, 2024",
      time: "6:00 AM - 12:00 PM",
      location: "Meskel Square, Addis Ababa",
      price: "ETB 600",
      category: "Sports",
      attendees: 1500,
      image: "/placeholder.svg?height=300&width=500&text=Addis+Marathon",
    },
    {
      id: 9,
      title: "Ethiopian Music Awards",
      date: "July 28, 2024",
      time: "7:00 PM - 11:00 PM",
      location: "Millennium Hall, Addis Ababa",
      price: "ETB 1200",
      category: "Entertainment",
      attendees: 800,
      image: "/placeholder.svg?height=300&width=500&text=Music+Awards",
    },
    {
      id: 10,
      title: "Agricultural Expo 2024",
      date: "August 10, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Exhibition Center, Addis Ababa",
      price: "ETB 150",
      category: "Business",
      attendees: 450,
      image: "/placeholder.svg?height=300&width=500&text=Agri+Expo",
    },
    {
      id: 11,
      title: "Ethiopian Coffee Championship",
      date: "August 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Hyatt Regency, Addis Ababa",
      price: "ETB 400",
      category: "Cultural",
      attendees: 200,
      image: "/placeholder.svg?height=300&width=500&text=Coffee+Championship",
    },
    {
      id: 12,
      title: "Tech Startup Hackathon",
      date: "September 5, 2024",
      time: "9:00 AM - 9:00 PM",
      location: "iceaddis, Addis Ababa",
      price: "ETB 100",
      category: "Technology",
      attendees: 150,
      image: "/placeholder.svg?height=300&width=500&text=Hackathon",
    },
    {
      id: 13,
      title: "Ethiopian Fashion Showcase",
      date: "September 15, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "Sheraton Addis, Addis Ababa",
      price: "ETB 700",
      category: "Fashion",
      attendees: 350,
      image: "/placeholder.svg?height=300&width=500&text=Fashion+Showcase",
    },
    {
      id: 14,
      title: "Digital Marketing Conference",
      date: "September 28, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Capital Hotel, Addis Ababa",
      price: "ETB 800",
      category: "Business",
      attendees: 220,
      image: "/placeholder.svg?height=300&width=500&text=Marketing+Conference",
    },
    {
      id: 15,
      title: "Ethiopian New Year Festival",
      date: "September 11, 2024",
      time: "10:00 AM - 10:00 PM",
      location: "Meskel Square, Addis Ababa",
      price: "Free",
      category: "Cultural",
      attendees: 5000,
      image: "/placeholder.svg?height=300&width=500&text=New+Year+Festival",
    },
  ]

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
                  <Badge className="absolute top-3 right-3 bg-primary/80 hover:bg-primary">{event.category}</Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary/70" />
                      <span>
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary/70" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="font-semibold">{event.price}</span>
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
