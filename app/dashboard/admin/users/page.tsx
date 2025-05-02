"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, UserPlus, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "attendee"
  status: "active" | "inactive" | "pending"
  joinDate: string
  avatar?: string
}

interface Organizer {
  id: string
  name: string
  companyName: string
  email: string
  status: "approved" | "pending" | "rejected"
  joinDate: string
  avatar?: string
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // Sample data for users
  const users: User[] = [
    {
      id: "U001",
      name: "Abebe Kebede",
      email: "abebe@example.com",
      role: "admin",
      status: "active",
      joinDate: "Jan 15, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=AK",
    },
    {
      id: "U002",
      name: "Sara Mohammed",
      email: "sara@example.com",
      role: "organizer",
      status: "active",
      joinDate: "Feb 3, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
    },
    {
      id: "U003",
      name: "Daniel Tesfaye",
      email: "daniel@example.com",
      role: "attendee",
      status: "active",
      joinDate: "Feb 10, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=DT",
    },
    {
      id: "U004",
      name: "Hiwot Girma",
      email: "hiwot@example.com",
      role: "attendee",
      status: "inactive",
      joinDate: "Mar 5, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=HG",
    },
    {
      id: "U005",
      name: "Yonas Haile",
      email: "yonas@example.com",
      role: "organizer",
      status: "pending",
      joinDate: "Apr 12, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=YH",
    },
    {
      id: "U006",
      name: "Tigist Alemu",
      email: "tigist@example.com",
      role: "attendee",
      status: "active",
      joinDate: "Apr 20, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=TA",
    },
  ]

  // Sample data for organizers
  const organizers: Organizer[] = [
    {
      id: "O001",
      name: "Sara Mohammed",
      companyName: "Tech Association",
      email: "sara@example.com",
      status: "approved",
      joinDate: "Feb 3, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
    },
    {
      id: "O002",
      name: "Yonas Haile",
      companyName: "Coffee Exporters",
      email: "yonas@example.com",
      status: "pending",
      joinDate: "Apr 12, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=YH",
    },
    {
      id: "O003",
      name: "Dawit Mekonnen",
      companyName: "National Museum",
      email: "dawit@example.com",
      status: "approved",
      joinDate: "Mar 8, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=DM",
    },
    {
      id: "O004",
      name: "Meron Tadesse",
      companyName: "Addis Chamber",
      email: "meron@example.com",
      status: "approved",
      joinDate: "Jan 25, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=MT",
    },
    {
      id: "O005",
      name: "Bereket Solomon",
      companyName: "iceaddis",
      email: "bereket@example.com",
      status: "rejected",
      joinDate: "Apr 5, 2024",
      avatar: "/placeholder.svg?height=40&width=40&text=BS",
    },
  ]

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  // Filter organizers based on search term and status
  const filteredOrganizers = organizers.filter((organizer) => {
    const matchesSearch =
      organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organizer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organizer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || organizer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and organizers on the platform</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account on the platform</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="attendee">Attendee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Active account</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddUserOpen(false)}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage all user accounts on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : user.role === "organizer"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : user.status === "inactive"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

        <TabsContent value="organizers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organizer Accounts</CardTitle>
              <CardDescription>Manage organizer accounts and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No organizers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrganizers.map((organizer) => (
                        <TableRow key={organizer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={organizer.avatar || "/placeholder.svg"} alt={organizer.name} />
                                <AvatarFallback>{organizer.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{organizer.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {organizer.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{organizer.companyName}</TableCell>
                          <TableCell>{organizer.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                organizer.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : organizer.status === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }
                            >
                              {organizer.status.charAt(0).toUpperCase() + organizer.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{organizer.joinDate}</TableCell>
                          <TableCell className="text-right">
                            {organizer.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                  <Check className="h-3 w-3" />
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1 text-red-600">
                                  <X className="h-3 w-3" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {organizer.status === "approved" ? (
                                    <DropdownMenuItem className="text-red-600">Revoke Approval</DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
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
      </Tabs>
    </div>
  )
}
