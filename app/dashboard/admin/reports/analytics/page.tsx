import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, Download, LineChart, PieChart, TrendingUp, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics for the EventEase platform</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,234</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="ml-1">from last week</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 256,789</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+15%</span>
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
              <span className="text-green-500 font-medium">+2.5%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="w-full">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>User growth chart will appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Acquisition Channels</CardTitle>
                <CardDescription>How users are finding the platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Acquisition channels chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>How many users return to the platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Retention chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Engagement</CardTitle>
              <CardDescription>User activity across the platform</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Engagement chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Performance metrics for events on the platform</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Event analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Platform revenue over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Revenue chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
