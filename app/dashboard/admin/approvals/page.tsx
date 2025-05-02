"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, Eye, Search, Trash, XCircle, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Event {
  id: number
  title: string
  organizer: string
  organizerLogo: string
  date: string
  location: string
  type: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
}

export default function EventApprovalsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Cultural Heritage Exhibition",
      organizer: "National Museum",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=NM",
      date: "May 28, 2024",
      location: "National Museum, Addis Ababa",
      type: "Exhibition",
      status: "pending",
      submittedDate: "May 10, 2024",
    },
    {
      id: 2,
      title: "Business Networking Mixer",
      organizer: "Addis Chamber",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=AC",
      date: "June 5, 2024",
      location: "Hyatt Regency, Addis Ababa",
      type: "Networking",
      status: "pending",
      submittedDate: "May 11, 2024",
    },
    {
      id: 3,
      title: "Tech Startup Showcase",
      organizer: "iceaddis",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=IA",
      date: "June 15, 2024",
      location: "iceaddis, Addis Ababa",
      type: "Conference",
      status: "pending",
      submittedDate: "May 12, 2024",
    },
    {
      id: 4,
      title: "Addis Tech Summit 2024",
      organizer: "Tech Association",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=TA",
      date: "May 15, 2024",
      location: "Millennium Hall, Addis Ababa",
      type: "Conference",
      status: "approved",
      submittedDate: "May 5, 2024",
    },
    {
      id: 5,
      title: "Ethiopian Coffee Festival",
      organizer: "Coffee Exporters",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=CE",
      date: "May 22, 2024",
      location: "Friendship Park, Addis Ababa",
      type: "Festival",
      status: "approved",
      submittedDate: "May 3, 2024",
    },
    {
      id: 6,
      title: "Fake Event Promotion",
      organizer: "Unknown Org",
      organizerLogo: "/placeholder.svg?height=40&width=40&text=UO",
      date: "June 30, 2024",
      location: "Unknown Location",
      type: "Other",
      status: "rejected",
      submittedDate: "May 8, 2024",
    },
  ])

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const handleApprove = (id: number) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, status: "approved" } : event)))
    setSelectedEvent(null)
  }

  const handleReject = (id: number) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, status: "rejected" } : event)))
    setSelectedEvent(null)
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterType === "all") return matchesSearch
    return matchesSearch && event.status === filterType
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Approvals</h1>
          <p className="text-muted-foreground">Review and manage event submissions</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events or organizers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredEvents.filter((event) => event.status === "pending").length === 0 ? (
            <div className="text-center py-10">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No pending events found</p>
            </div>
          ) : (
            filteredEvents
              .filter((event) => event.status === "pending")
              .map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={event.organizerLogo || "/placeholder.svg"} alt={event.organizer} />
                            <AvatarFallback>{event.organizer.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">By {event.organizer}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Submitted: {event.submittedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 p-6 bg-muted/20 border-t md:border-t-0 md:border-l">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full" onClick={() => setSelectedEvent(event)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Event Review: {selectedEvent?.title}</DialogTitle>
                              <DialogDescription>Review the event details before making a decision</DialogDescription>
                            </DialogHeader>

                            {selectedEvent && (
                              <div className="grid gap-6 py-4 overflow-y-auto pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <img
                                      src="/placeholder.svg?height=300&width=500&text=Event+Cover"
                                      alt="Event cover"
                                      className="w-full h-[200px] object-cover rounded-md"
                                    />
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={selectedEvent.organizerLogo || "/placeholder.svg"}
                                            alt={selectedEvent.organizer}
                                          />
                                          <AvatarFallback>{selectedEvent.organizer.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{selectedEvent.organizer}</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Date</Label>
                                        <p className="text-sm">{selectedEvent.date}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Type</Label>
                                        <p className="text-sm">{selectedEvent.type}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Location</Label>
                                        <p className="text-sm">{selectedEvent.location}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Submitted</Label>
                                        <p className="text-sm">{selectedEvent.submittedDate}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <Label className="text-sm font-medium">Event Description</Label>
                                  <p className="mt-2 text-sm">
                                    This is a sample description for {selectedEvent.title}. In a real application, this
                                    would contain the full description provided by the organizer.
                                  </p>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Verification Documents</Label>
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                                    {[
                                      { name: "Business License", type: "PDF" },
                                      { name: "Event Permit", type: "PDF" },
                                      { name: "Venue Confirmation", type: "Image" },
                                      { name: "Insurance Certificate", type: "PDF" },
                                    ].map((doc, index) => (
                                      <Card key={index} className="overflow-hidden">
                                        <CardContent className="p-0">
                                          <div className="bg-muted aspect-video flex items-center justify-center p-4">
                                            {doc.type === "PDF" ? (
                                              <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-muted-foreground"
                                              >
                                                <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                                                <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                                                <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
                                                  fill="currentColor"
                                                />
                                              </svg>
                                            ) : (
                                              <svg
                                                width="48"
                                                height="48"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-muted-foreground"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                                                  fill="currentColor"
                                                />
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M5 4C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5ZM2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5Z"
                                                  fill="currentColor"
                                                />
                                                <path
                                                  d="M18 8.5C18 8.22386 17.7761 8 17.5 8C17.2239 8 17 8.22386 17 8.5C17 8.77614 17.2239 9 17.5 9C17.7761 9 18 8.77614 18 8.5Z"
                                                  fill="currentColor"
                                                />
                                              </svg>
                                            )}
                                          </div>
                                          <div className="p-3">
                                            <h5 className="font-medium text-sm">{doc.name}</h5>
                                            <p className="text-xs text-muted-foreground mt-1">{doc.type} Document</p>
                                            <div className="flex justify-end mt-2">
                                              <Button variant="outline" size="sm">
                                                <Download className="h-3 w-3 mr-1" />
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <Label className="text-sm font-medium">Event Description</Label>
                                  <p className="mt-2 text-sm">
                                    This is a sample description for {selectedEvent.title}. In a real application, this
                                    would contain the full description provided by the organizer.
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="notes">Admin Notes</Label>
                                  <Textarea id="notes" placeholder="Add notes about this event..." />
                                </div>
                              </div>
                            )}

                            <DialogFooter className="flex justify-between mt-4 pt-2 border-t">
                              <Button
                                variant="destructive"
                                onClick={() => selectedEvent && handleReject(selectedEvent.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Event
                              </Button>
                              <Button onClick={() => selectedEvent && handleApprove(selectedEvent.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve Event
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button variant="default" className="w-full" onClick={() => handleApprove(event.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>

                        <Button variant="destructive" className="w-full" onClick={() => handleReject(event.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredEvents.filter((event) => event.status === "approved").length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No approved events found</p>
            </div>
          ) : (
            filteredEvents
              .filter((event) => event.status === "approved")
              .map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={event.organizerLogo || "/placeholder.svg"} alt={event.organizer} />
                          <AvatarFallback>{event.organizer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">By {event.organizer}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Approved
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Approved on: {event.submittedDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredEvents.filter((event) => event.status === "rejected").length === 0 ? (
            <div className="text-center py-10">
              <XCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No rejected events found</p>
            </div>
          ) : (
            filteredEvents
              .filter((event) => event.status === "rejected")
              .map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={event.organizerLogo || "/placeholder.svg"} alt={event.organizer} />
                          <AvatarFallback>{event.organizer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">By {event.organizer}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Rejected on: {event.submittedDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
