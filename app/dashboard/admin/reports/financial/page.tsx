"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminFinancialReportsPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOrganizer, setFilterOrganizer] = useState("all")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Platform-wide financial analytics and reporting</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 256,789</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 15%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 12,839</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 74.30</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by organizer or event..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[180px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[180px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Select value={filterOrganizer} onValueChange={setFilterOrganizer}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by organizer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizers</SelectItem>
              <SelectItem value="tech-association">Tech Association</SelectItem>
              <SelectItem value="coffee-exporters">Coffee Exporters</SelectItem>
              <SelectItem value="national-museum">National Museum</SelectItem>
              <SelectItem value="addis-chamber">Addis Chamber</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue by Organizer</TabsTrigger>
          <TabsTrigger value="events">Revenue by Event</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Organizer</CardTitle>
              <CardDescription>Financial performance of each organizer on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Total Events</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Gross Revenue</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Net Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tech Association</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>1,245</TableCell>
                      <TableCell>ETB 622,500</TableCell>
                      <TableCell>ETB 31,125</TableCell>
                      <TableCell>ETB 591,375</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Coffee Exporters</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>850</TableCell>
                      <TableCell>ETB 255,000</TableCell>
                      <TableCell>ETB 12,750</TableCell>
                      <TableCell>ETB 242,250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">National Museum</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>620</TableCell>
                      <TableCell>ETB 124,000</TableCell>
                      <TableCell>ETB 6,200</TableCell>
                      <TableCell>ETB 117,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Addis Chamber</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>180</TableCell>
                      <TableCell>ETB 180,000</TableCell>
                      <TableCell>ETB 9,000</TableCell>
                      <TableCell>ETB 171,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">iceaddis</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>320</TableCell>
                      <TableCell>ETB 80,000</TableCell>
                      <TableCell>ETB 4,000</TableCell>
                      <TableCell>ETB 76,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Event</CardTitle>
              <CardDescription>Financial performance of individual events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Gross Revenue</TableHead>
                      <TableHead>Platform Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Addis Tech Summit 2024</TableCell>
                      <TableCell>Tech Association</TableCell>
                      <TableCell>May 15, 2024</TableCell>
                      <TableCell>450</TableCell>
                      <TableCell>ETB 225,000</TableCell>
                      <TableCell>ETB 11,250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ethiopian Coffee Festival</TableCell>
                      <TableCell>Coffee Exporters</TableCell>
                      <TableCell>May 22, 2024</TableCell>
                      <TableCell>380</TableCell>
                      <TableCell>ETB 114,000</TableCell>
                      <TableCell>ETB 5,700</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cultural Heritage Exhibition</TableCell>
                      <TableCell>National Museum</TableCell>
                      <TableCell>May 28, 2024</TableCell>
                      <TableCell>210</TableCell>
                      <TableCell>ETB 42,000</TableCell>
                      <TableCell>ETB 2,100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Business Networking Mixer</TableCell>
                      <TableCell>Addis Chamber</TableCell>
                      <TableCell>June 5, 2024</TableCell>
                      <TableCell>120</TableCell>
                      <TableCell>ETB 120,000</TableCell>
                      <TableCell>ETB 6,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Startup Pitch Competition</TableCell>
                      <TableCell>iceaddis</TableCell>
                      <TableCell>June 12, 2024</TableCell>
                      <TableCell>180</TableCell>
                      <TableCell>ETB 45,000</TableCell>
                      <TableCell>ETB 2,250</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All payment transactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">TRX-001</TableCell>
                      <TableCell>Addis Tech Summit 2024</TableCell>
                      <TableCell>Tech Association</TableCell>
                      <TableCell>May 15, 2024</TableCell>
                      <TableCell>Telebirr</TableCell>
                      <TableCell>ETB 500.00</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TRX-002</TableCell>
                      <TableCell>Ethiopian Coffee Festival</TableCell>
                      <TableCell>Coffee Exporters</TableCell>
                      <TableCell>May 22, 2024</TableCell>
                      <TableCell>CBE</TableCell>
                      <TableCell>ETB 300.00</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TRX-003</TableCell>
                      <TableCell>Cultural Heritage Exhibition</TableCell>
                      <TableCell>National Museum</TableCell>
                      <TableCell>May 28, 2024</TableCell>
                      <TableCell>Dashen Bank</TableCell>
                      <TableCell>ETB 200.00</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TRX-004</TableCell>
                      <TableCell>Business Networking Mixer</TableCell>
                      <TableCell>Addis Chamber</TableCell>
                      <TableCell>June 5, 2024</TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell>ETB 1000.00</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TRX-005</TableCell>
                      <TableCell>Startup Pitch Competition</TableCell>
                      <TableCell>iceaddis</TableCell>
                      <TableCell>June 12, 2024</TableCell>
                      <TableCell>Telebirr</TableCell>
                      <TableCell>ETB 250.00</TableCell>
                      <TableCell>Failed</TableCell>
                    </TableRow>
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
              <CardDescription>Record of payments transferred to organizers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">PAY-001</TableCell>
                      <TableCell>Tech Association</TableCell>
                      <TableCell>May 20, 2024</TableCell>
                      <TableCell>ETB 213,750</TableCell>
                      <TableCell>CBE **** 5678</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PAY-002</TableCell>
                      <TableCell>Coffee Exporters</TableCell>
                      <TableCell>May 27, 2024</TableCell>
                      <TableCell>ETB 108,300</TableCell>
                      <TableCell>Dashen **** 9012</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PAY-003</TableCell>
                      <TableCell>National Museum</TableCell>
                      <TableCell>June 2, 2024</TableCell>
                      <TableCell>ETB 39,900</TableCell>
                      <TableCell>CBE **** 3456</TableCell>
                      <TableCell>Processing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PAY-004</TableCell>
                      <TableCell>Addis Chamber</TableCell>
                      <TableCell>June 10, 2024</TableCell>
                      <TableCell>ETB 114,000</TableCell>
                      <TableCell>Awash **** 7890</TableCell>
                      <TableCell>Processing</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
