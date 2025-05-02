import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, Download, PieChart, TrendingUp, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Analytics</h1>
          <p className="text-muted-foreground">Track performance and insights for your events</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="event1">Addis Tech Summit 2024</SelectItem>
              <SelectItem value="event2">Ethiopian Coffee Festival</SelectItem>
              <SelectItem value="event3">Cultural Heritage Exhibition</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+18%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Sales</CardTitle>
            <Calendar className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-primary-600"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+0.3</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Attendance Over Time</CardTitle>
            <CardDescription>Number of attendees per event over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Attendance chart will appear here</p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Ticket Type Distribution</CardTitle>
            <CardDescription>Breakdown of ticket sales by type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Ticket distribution chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
          <CardDescription>Understand your audience better</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Demographics chart will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
