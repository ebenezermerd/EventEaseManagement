"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  Download,
  Plus,
  Ticket,
  Tag,
  Users,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define ticket types with icons
const ticketTypes = [
  { id: "general", name: "General Admission", icon: <Ticket className="h-5 w-5" /> },
  { id: "vip", name: "VIP", icon: <Tag className="h-5 w-5" /> },
  { id: "early", name: "Early Bird", icon: <Clock className="h-5 w-5" /> },
  { id: "group", name: "Group", icon: <Users className="h-5 w-5" /> },
  { id: "student", name: "Student", icon: <Calendar className="h-5 w-5" /> },
]

export default function TicketsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null)

  // Sample ticket data
  const tickets = [
    {
      id: 1,
      name: "General Admission",
      event: "Addis Tech Summit 2024",
      price: "ETB 500",
      available: 200,
      sold: 120,
      status: "On Sale",
      type: "general",
      description: "Standard entry to the event with access to all general sessions.",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      maxPerOrder: 5,
      minPerOrder: 1,
      hasDiscount: false,
      discountCode: "",
      discountAmount: 0,
    },
    {
      id: 2,
      name: "VIP",
      event: "Addis Tech Summit 2024",
      price: "ETB 1,500",
      available: 50,
      sold: 30,
      status: "On Sale",
      type: "vip",
      description: "Premium access with reserved seating and exclusive networking opportunities.",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      maxPerOrder: 2,
      minPerOrder: 1,
      hasDiscount: true,
      discountCode: "VIP20",
      discountAmount: 20,
    },
    {
      id: 3,
      name: "General Admission",
      event: "Ethiopian Coffee Festival",
      price: "ETB 300",
      available: 300,
      sold: 85,
      status: "On Sale",
      type: "general",
      description: "Standard entry to the coffee festival with tasting opportunities.",
      startDate: "2024-05-10",
      endDate: "2024-05-22",
      maxPerOrder: 10,
      minPerOrder: 1,
      hasDiscount: false,
      discountCode: "",
      discountAmount: 0,
    },
    {
      id: 4,
      name: "Early Bird",
      event: "Cultural Heritage Exhibition",
      price: "ETB 150",
      available: 100,
      sold: 100,
      status: "Sold Out",
      type: "early",
      description: "Discounted early access tickets with special morning sessions.",
      startDate: "2024-04-15",
      endDate: "2024-05-01",
      maxPerOrder: 4,
      minPerOrder: 1,
      hasDiscount: true,
      discountCode: "EARLY25",
      discountAmount: 25,
    },
    {
      id: 5,
      name: "Standard",
      event: "Cultural Heritage Exhibition",
      price: "ETB 200",
      available: 200,
      sold: 42,
      status: "On Sale",
      type: "general",
      description: "Regular admission to the cultural heritage exhibition.",
      startDate: "2024-05-01",
      endDate: "2024-05-28",
      maxPerOrder: 8,
      minPerOrder: 1,
      hasDiscount: false,
      discountCode: "",
      discountAmount: 0,
    },
  ]

  const handleEditTicket = (ticket) => {
    setCurrentTicket(ticket)
    setIsEditModalOpen(true)
  }

  const getTicketIcon = (type) => {
    const ticketType = ticketTypes.find((t) => t.id === type)
    return ticketType ? ticketType.icon : <Ticket className="h-5 w-5" />
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">Manage tickets for all your events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Ticket Type
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="event1">Addis Tech Summit 2024</SelectItem>
            <SelectItem value="event2">Ethiopian Coffee Festival</SelectItem>
            <SelectItem value="event3">Cultural Heritage Exhibition</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Types</CardTitle>
          <CardDescription>Manage ticket types for your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          {getTicketIcon(ticket.type)}
                        </div>
                        <span className="font-medium">{ticket.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.event}</TableCell>
                    <TableCell>{ticket.price}</TableCell>
                    <TableCell>{ticket.available}</TableCell>
                    <TableCell>{ticket.sold}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          ticket.status === "On Sale"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTicket(ticket)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentTicket && getTicketIcon(currentTicket.type)}
              <span>Edit Ticket: {currentTicket?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Make changes to your ticket configuration here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {currentTicket && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-name">Ticket Name</Label>
                    <Input id="ticket-name" defaultValue={currentTicket.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-type">Ticket Type</Label>
                    <Select defaultValue={currentTicket.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticket-description">Description</Label>
                  <Textarea
                    id="ticket-description"
                    defaultValue={currentTicket.description}
                    placeholder="Describe what this ticket includes and any special benefits"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticket-event">Event</Label>
                  <Select defaultValue={currentTicket.event}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Addis Tech Summit 2024">Addis Tech Summit 2024</SelectItem>
                      <SelectItem value="Ethiopian Coffee Festival">Ethiopian Coffee Festival</SelectItem>
                      <SelectItem value="Cultural Heritage Exhibition">Cultural Heritage Exhibition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-price">Base Price (ETB)</Label>
                    <Input id="ticket-price" defaultValue={currentTicket.price.replace("ETB ", "")} type="text" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-fee">Service Fee</Label>
                    <Select defaultValue="included">
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="included">Included in price</SelectItem>
                        <SelectItem value="additional">Additional to price</SelectItem>
                        <SelectItem value="absorb">Absorb fee (organizer pays)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-discount">Enable Discount</Label>
                    <Switch id="has-discount" checked={currentTicket.hasDiscount} />
                  </div>
                </div>

                {currentTicket.hasDiscount && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/30">
                    <div className="space-y-2">
                      <Label htmlFor="discount-code">Discount Code</Label>
                      <Input id="discount-code" defaultValue={currentTicket.discountCode} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount-amount">Discount Amount (%)</Label>
                      <Input
                        id="discount-amount"
                        defaultValue={currentTicket.discountAmount}
                        type="number"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <RadioGroup defaultValue="percentage">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">Percentage (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Amount (ETB)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-quantity">Total Quantity</Label>
                    <Input
                      id="ticket-quantity"
                      defaultValue={currentTicket.available + currentTicket.sold}
                      type="number"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-status">Status</Label>
                    <Select defaultValue={currentTicket.status === "On Sale" ? "on-sale" : "sold-out"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-sale">On Sale</SelectItem>
                        <SelectItem value="sold-out">Sold Out</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-start">Sale Start Date</Label>
                    <Input id="sale-start" defaultValue={currentTicket.startDate} type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sale-end">Sale End Date</Label>
                    <Input id="sale-end" defaultValue={currentTicket.endDate} type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-per-order">Minimum per Order</Label>
                    <Input id="min-per-order" defaultValue={currentTicket.minPerOrder} type="number" min="1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-per-order">Maximum per Order</Label>
                    <Input id="max-per-order" defaultValue={currentTicket.maxPerOrder} type="number" min="1" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transferable">Transferable</Label>
                    <Switch id="transferable" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow attendees to transfer tickets to others</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="refundable">Refundable</Label>
                    <Switch id="refundable" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow attendees to request refunds</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refund-policy">Refund Policy</Label>
                  <Select defaultValue="7days">
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Up to 7 days before event</SelectItem>
                      <SelectItem value="14days">Up to 14 days before event</SelectItem>
                      <SelectItem value="30days">Up to 30 days before event</SelectItem>
                      <SelectItem value="custom">Custom policy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-remaining">Show Remaining Tickets</Label>
                    <Switch id="show-remaining" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Display the number of remaining tickets to attendees</p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex items-center justify-between mt-6">
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Ticket
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
