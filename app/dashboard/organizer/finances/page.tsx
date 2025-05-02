"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Download, Filter, Search, BarChart3, PieChart, TrendingUp, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OrganizerFinancesPage() {
  const [date, setDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState("all")

  // Sample data for events
  const events = [
    { id: "all", name: "All Events" },
    { id: "event1", name: "Addis Tech Summit 2024" },
    { id: "event2", name: "Ethiopian Coffee Festival" },
    { id: "event3", name: "Cultural Heritage Exhibition" },
    { id: "event4", name: "Business Networking Mixer" },
  ]

  // Sample data for transactions
  const allTransactions = [
    {
      id: "TRX-001",
      eventId: "event1",
      event: "Addis Tech Summit 2024",
      date: "May 15, 2024",
      amount: "ETB 500.00",
      attendee: "Abebe Kebede",
      paymentMethod: "Telebirr",
      status: "completed",
    },
    {
      id: "TRX-002",
      eventId: "event1",
      event: "Addis Tech Summit 2024",
      date: "May 15, 2024",
      amount: "ETB 500.00",
      attendee: "Sara Mohammed",
      paymentMethod: "CBE",
      status: "completed",
    },
    {
      id: "TRX-003",
      eventId: "event2",
      event: "Ethiopian Coffee Festival",
      date: "May 22, 2024",
      amount: "ETB 300.00",
      attendee: "Daniel Tesfaye",
      paymentMethod: "Telebirr",
      status: "completed",
    },
    {
      id: "TRX-004",
      eventId: "event2",
      event: "Ethiopian Coffee Festival",
      date: "May 22, 2024",
      amount: "ETB 300.00",
      attendee: "Hiwot Girma",
      paymentMethod: "Dashen Bank",
      status: "pending",
    },
    {
      id: "TRX-005",
      eventId: "event3",
      event: "Cultural Heritage Exhibition",
      date: "May 28, 2024",
      amount: "ETB 200.00",
      attendee: "Yonas Haile",
      paymentMethod: "Credit Card",
      status: "completed",
    },
    {
      id: "TRX-006",
      eventId: "event3",
      event: "Cultural Heritage Exhibition",
      date: "May 28, 2024",
      amount: "ETB 200.00",
      attendee: "Tigist Alemu",
      paymentMethod: "Telebirr",
      status: "failed",
    },
    {
      id: "TRX-007",
      eventId: "event4",
      event: "Business Networking Mixer",
      date: "June 5, 2024",
      amount: "ETB 1000.00",
      attendee: "Dawit Mekonnen",
      paymentMethod: "Awash Bank",
      status: "completed",
    },
    {
      id: "TRX-008",
      eventId: "event4",
      event: "Business Networking Mixer",
      date: "June 5, 2024",
      amount: "ETB 1000.00",
      attendee: "Meron Tadesse",
      paymentMethod: "Telebirr",
      status: "refunded",
    },
  ]

  // Filter transactions based on selected event, search term and status
  const transactions = allTransactions.filter((transaction) => {
    const matchesEvent = selectedEvent === "all" || transaction.eventId === selectedEvent
    const matchesSearch =
      transaction.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.attendee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesEvent && matchesSearch
    return matchesEvent && matchesSearch && transaction.status === filterStatus
  })

  // Calculate summary statistics based on filtered transactions
  const calculateStats = (transactions) => {
    const totalRevenue = transactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + Number.parseInt(t.amount.replace("ETB ", "").replace(",", "")), 0)

    const pendingRevenue = transactions
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + Number.parseInt(t.amount.replace("ETB ", "").replace(",", "")), 0)

    const refundedAmount = transactions
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + Number.parseInt(t.amount.replace("ETB ", "").replace(",", "")), 0)

    return { totalRevenue, pendingRevenue, refundedAmount }
  }

  const stats = calculateStats(transactions)

  // Sample data for revenue by event
  const revenueByEvent = [
    {
      id: "event1",
      name: "Addis Tech Summit 2024",
      date: "May 15, 2024",
      ticketsSold: 120,
      grossRevenue: 60000,
      platformFee: 3000,
      netRevenue: 57000,
    },
    {
      id: "event2",
      name: "Ethiopian Coffee Festival",
      date: "May 22, 2024",
      ticketsSold: 85,
      grossRevenue: 25500,
      platformFee: 1275,
      netRevenue: 24225,
    },
    {
      id: "event3",
      name: "Cultural Heritage Exhibition",
      date: "May 28, 2024",
      ticketsSold: 42,
      grossRevenue: 8400,
      platformFee: 420,
      netRevenue: 7980,
    },
    {
      id: "event4",
      name: "Business Networking Mixer",
      date: "June 5, 2024",
      ticketsSold: 18,
      grossRevenue: 18000,
      platformFee: 900,
      netRevenue: 17100,
    },
  ]

  // Filter revenue data based on selected event
  const filteredRevenueData =
    selectedEvent === "all" ? revenueByEvent : revenueByEvent.filter((event) => event.id === selectedEvent)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Track your event revenue and payment transactions</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedEvent === "all"
                ? "From all completed transactions"
                : `From ${events.find((e) => e.id === selectedEvent)?.name}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {stats.pendingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From pending transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Refunded Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {stats.refundedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total refunded to attendees</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue by Event</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {selectedEvent === "all"
                  ? "View all payment transactions for your events"
                  : `View payment transactions for ${events.find((e) => e.id === selectedEvent)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Filter by date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.event}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.attendee}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : transaction.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : transaction.status === "failed"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                              )}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Event</CardTitle>
              <CardDescription>
                {selectedEvent === "all"
                  ? "Breakdown of revenue for each of your events"
                  : `Revenue breakdown for ${events.find((e) => e.id === selectedEvent)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Gross Revenue</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Net Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRevenueData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No revenue data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRevenueData.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.ticketsSold}</TableCell>
                          <TableCell>ETB {event.grossRevenue.toLocaleString()}</TableCell>
                          <TableCell>ETB {event.platformFee.toLocaleString()}</TableCell>
                          <TableCell className="font-medium">ETB {event.netRevenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Record of payments transferred to your bank account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">PAY-001</TableCell>
                      <TableCell>May 20, 2024</TableCell>
                      <TableCell>ETB 57,000</TableCell>
                      <TableCell>CBE **** 1234</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PAY-002</TableCell>
                      <TableCell>May 27, 2024</TableCell>
                      <TableCell>ETB 24,225</TableCell>
                      <TableCell>CBE **** 1234</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PAY-003</TableCell>
                      <TableCell>June 2, 2024</TableCell>
                      <TableCell>ETB 7,980</TableCell>
                      <TableCell>CBE **** 1234</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Processing
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>
                {selectedEvent === "all"
                  ? "Visual breakdown of your financial performance"
                  : `Financial analytics for ${events.find((e) => e.id === selectedEvent)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>Revenue chart visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Revenue Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>Trend chart visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Financial Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Average Transaction Value</p>
                        <p className="text-xl font-bold">ETB 450.00</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Revenue per Attendee</p>
                        <p className="text-xl font-bold">ETB 650.00</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Refund Rate</p>
                        <p className="text-xl font-bold">3.2%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
