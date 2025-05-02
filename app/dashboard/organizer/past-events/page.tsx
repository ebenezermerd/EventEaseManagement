"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Search,
  Filter,
  Download,
  Clock,
  Users,
  DollarSign,
  Star,
  MapPin,
  BarChart3,
  PieChart,
  FileText,
  Share2,
  Printer,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function PastEventsPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Sample data for past events
  const pastEvents = [
    {
      id: 1,
      name: "Tech Meetup 2023",
      date: "Dec 15, 2023",
      attendees: 120,
      revenue: "ETB 60,000",
      rating: "4.8/5",
      location: "Addis Ababa, Bole",
      description: "A networking event for tech professionals in Addis Ababa.",
      organizer: "Tech Community Ethiopia",
      duration: "3 hours",
      ticketsSold: 120,
      ticketsAvailable: 150,
      categories: ["Technology", "Networking"],
      sponsors: [
        { name: "TechCorp", logo: "/placeholder.svg?height=40&width=40" },
        { name: "Digital Ethiopia", logo: "/placeholder.svg?height=40&width=40" },
      ],
      feedback: [
        { rating: 5, count: 80 },
        { rating: 4, count: 30 },
        { rating: 3, count: 8 },
        { rating: 2, count: 2 },
        { rating: 1, count: 0 },
      ],
      topAttendees: [
        { name: "Abebe Kebede", avatar: "/placeholder.svg?height=40&width=40", company: "TechCorp" },
        { name: "Sara Mohammed", avatar: "/placeholder.svg?height=40&width=40", company: "Digital Ethiopia" },
        { name: "Daniel Tesfaye", avatar: "/placeholder.svg?height=40&width=40", company: "Startup Inc" },
      ],
      financials: {
        ticketRevenue: 60000,
        expenses: 15000,
        netProfit: 45000,
        averageTicketPrice: 500,
        refunds: 2,
        refundAmount: 1000,
      },
      demographics: {
        gender: { male: 65, female: 35 },
        age: { "18-24": 15, "25-34": 45, "35-44": 30, "45+": 10 },
        location: { "Addis Ababa": 80, "Other Cities": 20 },
      },
      timeline: [
        { time: "09:00 AM", activity: "Registration", attendees: 120 },
        { time: "10:00 AM", activity: "Opening Keynote", attendees: 118 },
        { time: "11:30 AM", activity: "Panel Discussion", attendees: 115 },
        { time: "01:00 PM", activity: "Networking Lunch", attendees: 120 },
        { time: "02:30 PM", activity: "Workshops", attendees: 110 },
        { time: "04:00 PM", activity: "Closing Remarks", attendees: 105 },
      ],
    },
    {
      id: 2,
      name: "Coffee Tasting Workshop",
      date: "Jan 22, 2024",
      attendees: 45,
      revenue: "ETB 13,500",
      rating: "4.9/5",
      location: "Addis Ababa, Kazanchis",
      description: "A workshop exploring Ethiopia's finest coffee varieties.",
      organizer: "Ethiopian Coffee Association",
      duration: "2 hours",
      ticketsSold: 45,
      ticketsAvailable: 50,
      categories: ["Food & Drink", "Workshop"],
      sponsors: [{ name: "Coffee Exports Ltd", logo: "/placeholder.svg?height=40&width=40" }],
      feedback: [
        { rating: 5, count: 40 },
        { rating: 4, count: 5 },
        { rating: 3, count: 0 },
        { rating: 2, count: 0 },
        { rating: 1, count: 0 },
      ],
      topAttendees: [
        { name: "Hiwot Girma", avatar: "/placeholder.svg?height=40&width=40", company: "Coffee Exports Ltd" },
        { name: "Yonas Haile", avatar: "/placeholder.svg?height=40&width=40", company: "Cafe Owner" },
      ],
      financials: {
        ticketRevenue: 13500,
        expenses: 5000,
        netProfit: 8500,
        averageTicketPrice: 300,
        refunds: 0,
        refundAmount: 0,
      },
      demographics: {
        gender: { male: 55, female: 45 },
        age: { "18-24": 10, "25-34": 35, "35-44": 40, "45+": 15 },
        location: { "Addis Ababa": 90, "Other Cities": 10 },
      },
      timeline: [
        { time: "02:00 PM", activity: "Introduction to Coffee", attendees: 45 },
        { time: "02:30 PM", activity: "Tasting Session 1", attendees: 45 },
        { time: "03:15 PM", activity: "Coffee Processing Demo", attendees: 45 },
        { time: "03:45 PM", activity: "Tasting Session 2", attendees: 45 },
      ],
    },
    {
      id: 3,
      name: "Business Networking Event",
      date: "Feb 10, 2024",
      attendees: 85,
      revenue: "ETB 85,000",
      rating: "4.5/5",
      location: "Addis Ababa, Meskel Square",
      description: "Connect with business leaders and entrepreneurs.",
      organizer: "Ethiopian Chamber of Commerce",
      duration: "4 hours",
      ticketsSold: 85,
      ticketsAvailable: 100,
      categories: ["Business", "Networking"],
      sponsors: [
        { name: "National Bank", logo: "/placeholder.svg?height=40&width=40" },
        { name: "Business Weekly", logo: "/placeholder.svg?height=40&width=40" },
      ],
      feedback: [
        { rating: 5, count: 50 },
        { rating: 4, count: 25 },
        { rating: 3, count: 8 },
        { rating: 2, count: 2 },
        { rating: 1, count: 0 },
      ],
      topAttendees: [
        { name: "Dawit Mekonnen", avatar: "/placeholder.svg?height=40&width=40", company: "National Bank" },
        { name: "Meron Tadesse", avatar: "/placeholder.svg?height=40&width=40", company: "Startup Incubator" },
        { name: "Tigist Alemu", avatar: "/placeholder.svg?height=40&width=40", company: "Tech Solutions" },
      ],
      financials: {
        ticketRevenue: 85000,
        expenses: 25000,
        netProfit: 60000,
        averageTicketPrice: 1000,
        refunds: 1,
        refundAmount: 1000,
      },
      demographics: {
        gender: { male: 60, female: 40 },
        age: { "18-24": 5, "25-34": 30, "35-44": 45, "45+": 20 },
        location: { "Addis Ababa": 75, "Other Cities": 25 },
      },
      timeline: [
        { time: "04:00 PM", activity: "Registration & Welcome", attendees: 85 },
        { time: "04:30 PM", activity: "Keynote Speech", attendees: 85 },
        { time: "05:30 PM", activity: "Structured Networking", attendees: 85 },
        { time: "06:30 PM", activity: "Panel Discussion", attendees: 80 },
        { time: "07:30 PM", activity: "Open Networking & Refreshments", attendees: 85 },
      ],
    },
    {
      id: 4,
      name: "Art Exhibition",
      date: "Mar 5, 2024",
      attendees: 210,
      revenue: "ETB 42,000",
      rating: "4.7/5",
      location: "Addis Ababa, National Museum",
      description: "Showcasing contemporary Ethiopian art and artists.",
      organizer: "Ethiopian Arts Council",
      duration: "8 hours",
      ticketsSold: 210,
      ticketsAvailable: 250,
      categories: ["Arts & Culture", "Exhibition"],
      sponsors: [
        { name: "Cultural Ministry", logo: "/placeholder.svg?height=40&width=40" },
        { name: "Arts Foundation", logo: "/placeholder.svg?height=40&width=40" },
      ],
      feedback: [
        { rating: 5, count: 150 },
        { rating: 4, count: 50 },
        { rating: 3, count: 8 },
        { rating: 2, count: 2 },
        { rating: 1, count: 0 },
      ],
      topAttendees: [
        { name: "Famous Artist", avatar: "/placeholder.svg?height=40&width=40", company: "Independent" },
        { name: "Gallery Owner", avatar: "/placeholder.svg?height=40&width=40", company: "City Gallery" },
      ],
      financials: {
        ticketRevenue: 42000,
        expenses: 15000,
        netProfit: 27000,
        averageTicketPrice: 200,
        refunds: 5,
        refundAmount: 1000,
      },
      demographics: {
        gender: { male: 45, female: 55 },
        age: { "18-24": 25, "25-34": 35, "35-44": 25, "45+": 15 },
        location: { "Addis Ababa": 85, "Other Cities": 15 },
      },
      timeline: [
        { time: "10:00 AM", activity: "Exhibition Opens", attendees: 50 },
        { time: "12:00 PM", activity: "Artist Talk", attendees: 120 },
        { time: "02:00 PM", activity: "Guided Tour", attendees: 80 },
        { time: "04:00 PM", activity: "Workshop", attendees: 40 },
        { time: "06:00 PM", activity: "Closing Reception", attendees: 180 },
      ],
    },
    {
      id: 5,
      name: "Music Festival",
      date: "Apr 12, 2024",
      attendees: 350,
      revenue: "ETB 175,000",
      rating: "4.6/5",
      location: "Addis Ababa, Millennium Hall",
      description: "A celebration of Ethiopian music and culture.",
      organizer: "Music Ethiopia",
      duration: "10 hours",
      ticketsSold: 350,
      ticketsAvailable: 400,
      categories: ["Music", "Festival"],
      sponsors: [
        { name: "Sound Systems Inc", logo: "/placeholder.svg?height=40&width=40" },
        { name: "Beverage Company", logo: "/placeholder.svg?height=40&width=40" },
        { name: "Radio Station", logo: "/placeholder.svg?height=40&width=40" },
      ],
      feedback: [
        { rating: 5, count: 200 },
        { rating: 4, count: 100 },
        { rating: 3, count: 40 },
        { rating: 2, count: 10 },
        { rating: 1, count: 0 },
      ],
      topAttendees: [
        { name: "Music Producer", avatar: "/placeholder.svg?height=40&width=40", company: "Record Label" },
        { name: "Famous Singer", avatar: "/placeholder.svg?height=40&width=40", company: "Independent" },
      ],
      financials: {
        ticketRevenue: 175000,
        expenses: 80000,
        netProfit: 95000,
        averageTicketPrice: 500,
        refunds: 10,
        refundAmount: 5000,
      },
      demographics: {
        gender: { male: 52, female: 48 },
        age: { "18-24": 40, "25-34": 35, "35-44": 15, "45+": 10 },
        location: { "Addis Ababa": 70, "Other Cities": 30 },
      },
      timeline: [
        { time: "12:00 PM", activity: "Gates Open", attendees: 100 },
        { time: "01:00 PM", activity: "Opening Act", attendees: 200 },
        { time: "03:00 PM", activity: "Main Stage Performances", attendees: 350 },
        { time: "06:00 PM", activity: "Headliner Act", attendees: 350 },
        { time: "08:00 PM", activity: "Closing Performance", attendees: 300 },
      ],
    },
  ]

  const handleViewReport = (event) => {
    setSelectedEvent(event)
    setIsReportModalOpen(true)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Past Events</h1>
          <p className="text-muted-foreground">View and analyze your completed events</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search past events..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Events</CardTitle>
          <CardDescription>All your completed events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="font-medium">{event.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>{event.attendees}</TableCell>
                    <TableCell>{event.revenue}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        {event.rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewReport(event)}>
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Event Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">Event Report: {selectedEvent.name}</DialogTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <DialogDescription>Comprehensive analysis and statistics for {selectedEvent.name}</DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedEvent.attendees}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((selectedEvent.attendees / selectedEvent.ticketsAvailable) * 100)}% of capacity
                      </div>
                      <Progress
                        value={(selectedEvent.attendees / selectedEvent.ticketsAvailable) * 100}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedEvent.revenue}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Net profit: ETB {selectedEvent.financials.netProfit.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedEvent.rating}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        From {selectedEvent.feedback.reduce((sum, item) => sum + item.count, 0)} reviews
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                              <p>{selectedEvent.description}</p>
                            </div>

                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Location</h3>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedEvent.location}</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Date & Duration</h3>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {selectedEvent.date} ({selectedEvent.duration})
                                </span>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Categories</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEvent.categories.map((category, index) => (
                                  <Badge key={index} variant="outline">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Organizer</h3>
                              <p>{selectedEvent.organizer}</p>
                            </div>

                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Sponsors</h3>
                              <div className="flex flex-wrap gap-3 mt-2">
                                {selectedEvent.sponsors.map((sponsor, index) => (
                                  <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                                      <img
                                        src={sponsor.logo || "/placeholder.svg"}
                                        alt={sponsor.name}
                                        className="h-6 w-6"
                                      />
                                    </div>
                                    <span className="text-sm">{sponsor.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium text-sm text-muted-foreground mb-1">Key Metrics</h3>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                                  <p className="font-medium">
                                    {selectedEvent.ticketsSold} / {selectedEvent.ticketsAvailable}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Avg. Ticket Price</p>
                                  <p className="font-medium">ETB {selectedEvent.financials.averageTicketPrice}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Refunds</p>
                                  <p className="font-medium">{selectedEvent.financials.refunds} tickets</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Net Profit</p>
                                  <p className="font-medium">
                                    ETB {selectedEvent.financials.netProfit.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">Notable Attendees</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedEvent.topAttendees.map((attendee, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                                  <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{attendee.name}</p>
                                  <p className="text-sm text-muted-foreground">{attendee.company}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">Demographics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Gender Distribution</h3>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${selectedEvent.demographics.gender.male}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs whitespace-nowrap">
                                  {selectedEvent.demographics.gender.male}% Male /{" "}
                                  {selectedEvent.demographics.gender.female}% Female
                                </span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Age Groups</h3>
                              <div className="grid grid-cols-4 gap-1 text-xs">
                                {Object.entries(selectedEvent.demographics.age).map(([age, percentage]) => (
                                  <div key={age} className="text-center">
                                    <div className="mb-1">{age}</div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <div className="mt-1">{percentage}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Location</h3>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${selectedEvent.demographics.location["Addis Ababa"]}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs whitespace-nowrap">
                                  {selectedEvent.demographics.location["Addis Ababa"]}% Addis Ababa
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="attendance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attendance Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-center justify-center mb-6">
                          <div className="text-center text-muted-foreground">
                            <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                            <p>Attendance chart visualization would appear here</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">98%</div>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(selectedEvent.attendees * 0.98)} of {selectedEvent.attendees} checked in
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">2%</div>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(selectedEvent.attendees * 0.02)} tickets unused
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {Math.round((selectedEvent.attendees / selectedEvent.ticketsAvailable) * 100)}%
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {selectedEvent.ticketsAvailable - selectedEvent.attendees} seats unfilled
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Attendee Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Attendees</TableHead>
                                <TableHead>Engagement Rate</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedEvent.timeline.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{item.activity}</TableCell>
                                  <TableCell>{item.time}</TableCell>
                                  <TableCell>{item.attendees}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={(item.attendees / selectedEvent.attendees) * 100}
                                        className="h-2 w-24"
                                      />
                                      <span>{Math.round((item.attendees / selectedEvent.attendees) * 100)}%</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financials" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="h-[250px] flex items-center justify-center mb-4">
                              <div className="text-center text-muted-foreground">
                                <PieChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                                <p>Revenue breakdown chart would appear here</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Ticket Revenue</span>
                              <span className="font-medium">
                                ETB {selectedEvent.financials.ticketRevenue.toLocaleString()}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Total Expenses</span>
                              <span className="font-medium">
                                ETB {selectedEvent.financials.expenses.toLocaleString()}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Refunds</span>
                              <span className="font-medium">
                                ETB {selectedEvent.financials.refundAmount.toLocaleString()}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center font-bold">
                              <span>Net Profit</span>
                              <span>ETB {selectedEvent.financials.netProfit.toLocaleString()}</span>
                            </div>
                            <div className="pt-2">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {Math.round(
                                  (selectedEvent.financials.netProfit / selectedEvent.financials.ticketRevenue) * 100,
                                )}
                                % Profit Margin
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Ticket Sales Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Average Ticket Price</h3>
                              <p className="text-xl font-bold">ETB {selectedEvent.financials.averageTicketPrice}</p>
                            </div>

                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Revenue per Attendee</h3>
                              <p className="text-xl font-bold">
                                ETB {Math.round(selectedEvent.financials.ticketRevenue / selectedEvent.attendees)}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm text-muted-foreground mb-1">Refund Rate</h3>
                              <p className="text-xl font-bold">
                                {Math.round((selectedEvent.financials.refunds / selectedEvent.ticketsSold) * 100)}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedEvent.financials.refunds} tickets refunded (ETB{" "}
                                {selectedEvent.financials.refundAmount.toLocaleString()})
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Expense Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <PieChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                              <p>Expense breakdown chart would appear here</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Venue</p>
                              <p className="font-medium">
                                ETB {Math.round(selectedEvent.financials.expenses * 0.4).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Marketing</p>
                              <p className="font-medium">
                                ETB {Math.round(selectedEvent.financials.expenses * 0.2).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Staff</p>
                              <p className="font-medium">
                                ETB {Math.round(selectedEvent.financials.expenses * 0.25).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Other</p>
                              <p className="font-medium">
                                ETB {Math.round(selectedEvent.financials.expenses * 0.15).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attendee Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="text-4xl font-bold">{selectedEvent.rating.split("/")[0]}</div>
                              <div className="space-y-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-5 w-5 ${star <= Number.parseFloat(selectedEvent.rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Based on {selectedEvent.feedback.reduce((sum, item) => sum + item.count, 0)} reviews
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {selectedEvent.feedback.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-12 text-sm">{item.rating} stars</div>
                                  <div className="flex-1">
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div
                                        className="bg-amber-500 h-2 rounded-full"
                                        style={{
                                          width: `${(item.count / selectedEvent.feedback.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="w-12 text-sm text-right">{item.count}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium mb-4">Key Feedback Insights</h3>
                            <div className="space-y-4">
                              <div className="p-4 border rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-green-100 text-green-800">Positive</Badge>
                                  <h4 className="font-medium">Great organization</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  85% of attendees mentioned excellent organization and smooth check-in process
                                </p>
                              </div>

                              <div className="p-4 border rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-green-100 text-green-800">Positive</Badge>
                                  <h4 className="font-medium">Content quality</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  78% of attendees praised the quality of content and presentations
                                </p>
                              </div>

                              <div className="p-4 border rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-red-100 text-red-800">Improvement</Badge>
                                  <h4 className="font-medium">Venue temperature</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  23% of attendees mentioned the venue was too cold
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Testimonials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-md">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback>AB</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">Abebe Kebede</p>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-3 w-3 text-amber-500 fill-amber-500" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">
                              "This was one of the best organized events I've attended. The content was excellent and
                              networking opportunities were valuable."
                            </p>
                          </div>

                          <div className="p-4 border rounded-md">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback>SM</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">Sara Mohammed</p>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${star <= 4 ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">
                              "Great event overall. The speakers were knowledgeable and I made some valuable
                              connections. The venue was a bit cold though."
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 text-center">
                          <Button variant="outline" size="sm" className="gap-1">
                            View All Testimonials
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative border-l-2 border-muted pl-6 ml-4 space-y-8">
                          {selectedEvent.timeline.map((item, index) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-[30px] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <Clock className="h-3 w-3 text-primary-foreground" />
                              </div>
                              <div className="mb-1 text-lg font-medium">{item.time}</div>
                              <div className="mb-2">{item.activity}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{item.attendees} attendees</span>
                                <span>
                                  ({Math.round((item.attendees / selectedEvent.attendees) * 100)}% attendance)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Peak Times</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center mb-4">
                            <div className="text-center text-muted-foreground">
                              <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                              <p>Attendance over time chart would appear here</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Peak Attendance Time</span>
                              <span className="font-medium">
                                {
                                  selectedEvent.timeline.reduce((max, item) =>
                                    item.attendees > max.attendees ? item : max,
                                  ).time
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Lowest Attendance Time</span>
                              <span className="font-medium">
                                {
                                  selectedEvent.timeline.reduce((min, item) =>
                                    item.attendees < min.attendees ? item : min,
                                  ).time
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Average Attendance</span>
                              <span className="font-medium">
                                {Math.round(
                                  selectedEvent.timeline.reduce((sum, item) => sum + item.attendees, 0) /
                                    selectedEvent.timeline.length,
                                )}{" "}
                                attendees
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Activity Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Activity</TableHead>
                                  <TableHead>Engagement</TableHead>
                                  <TableHead className="text-right">Rating</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedEvent.timeline.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{item.activity}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={(item.attendees / selectedEvent.attendees) * 100}
                                          className="h-2 w-24"
                                        />
                                        <span>{Math.round((item.attendees / selectedEvent.attendees) * 100)}%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Badge
                                        variant="outline"
                                        className={
                                          item.attendees > selectedEvent.attendees * 0.9
                                            ? "bg-green-100 text-green-800"
                                            : item.attendees > selectedEvent.attendees * 0.7
                                              ? "bg-amber-100 text-amber-800"
                                              : "bg-red-100 text-red-800"
                                        }
                                      >
                                        {item.attendees > selectedEvent.attendees * 0.9
                                          ? "Excellent"
                                          : item.attendees > selectedEvent.attendees * 0.7
                                            ? "Good"
                                            : "Fair"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                  Close Report
                </Button>
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Full Report
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
