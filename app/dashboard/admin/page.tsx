import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, CheckCircle2, Clock, DollarSign, TrendingUp, User, Users, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin!</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Today:</span>
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
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
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizers</CardTitle>
            <User className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary-600" />
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
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
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
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Platform Revenue</CardTitle>
              <CardDescription>Monthly revenue from events</CardDescription>
            </div>
            <Link href="/dashboard/admin/reports/financial">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Revenue chart will appear here</p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Events waiting for approval</CardDescription>
            </div>
            <Link href="/dashboard/admin/approvals">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 1, name: "Cultural Heritage Exhibition", organizer: "National Museum", date: "May 10, 2024" },
              { id: 2, name: "Business Networking Mixer", organizer: "Addis Chamber", date: "May 11, 2024" },
              { id: 3, name: "Tech Startup Showcase", organizer: "iceaddis", date: "May 12, 2024" },
            ].map((event) => (
              <div key={event.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{event.name}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <User className="mr-1 h-3 w-3" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Submitted: {event.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Organizer Registrations</CardTitle>
              <CardDescription>New organizers awaiting verification</CardDescription>
            </div>
            <Link href="/dashboard/admin/organizations">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Abyssinia Events", contact: "Abebe Kebede", date: "May 10, 2024", status: "Pending" },
                {
                  id: 2,
                  name: "Habesha Promotions",
                  contact: "Sara Mohammed",
                  date: "May 9, 2024",
                  status: "Approved",
                },
                { id: 3, name: "Addis Organizers", contact: "Daniel Tesfaye", date: "May 8, 2024", status: "Rejected" },
              ].map((organizer) => (
                <div
                  key={organizer.id}
                  className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{organizer.name}</p>
                    <p className="text-xs text-muted-foreground">{organizer.contact}</p>
                    <p className="text-xs text-muted-foreground">Registered: {organizer.date}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        organizer.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : organizer.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {organizer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-transparent hover:border-primary-200 transition-colors">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Event Activity</CardTitle>
              <CardDescription>Latest event approvals and rejections</CardDescription>
            </div>
            <Link href="/dashboard/admin/reports/analytics">
              <Button variant="outline" size="sm">
                View Analytics
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Addis Tech Summit 2024", action: "Approved", date: "May 10, 2024", admin: "Admin1" },
                { id: 2, name: "Ethiopian Coffee Festival", action: "Approved", date: "May 9, 2024", admin: "Admin2" },
                { id: 3, name: "Fake Event Promotion", action: "Rejected", date: "May 8, 2024", admin: "Admin1" },
                {
                  id: 4,
                  name: "Cultural Heritage Exhibition",
                  action: "Pending",
                  date: "May 7, 2024",
                  admin: "Admin3",
                },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                  <div className="mr-3">
                    {activity.action === "Approved" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : activity.action === "Rejected" ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} by {activity.admin} on {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* The admin dashboard is already using cards for all elements, so no changes needed here. */}
      {/* Just adding a comment to confirm this was checked. */}
    </div>
  )
}
