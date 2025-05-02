"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, Download, Eye, Check, X } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

interface Organization {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  tinNumber: string
  status: "approved" | "pending" | "rejected"
  registrationDate: string
  logo?: string
}

export default function AdminOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [viewDocuments, setViewDocuments] = useState(false)

  // Sample data for organizations
  const organizations: Organization[] = [
    {
      id: "ORG001",
      name: "Tech Association",
      contactPerson: "Sara Mohammed",
      email: "contact@techassociation.com",
      phone: "+251 91 234 5678",
      tinNumber: "0012345678",
      status: "approved",
      registrationDate: "Feb 3, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=TA",
    },
    {
      id: "ORG002",
      name: "Coffee Exporters",
      contactPerson: "Yonas Haile",
      email: "info@coffeeexporters.com",
      phone: "+251 92 345 6789",
      tinNumber: "0023456789",
      status: "approved",
      registrationDate: "Apr 12, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=CE",
    },
    {
      id: "ORG003",
      name: "National Museum",
      contactPerson: "Dawit Mekonnen",
      email: "info@nationalmuseum.org",
      phone: "+251 93 456 7890",
      tinNumber: "0034567890",
      status: "approved",
      registrationDate: "Mar 8, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=NM",
    },
    {
      id: "ORG004",
      name: "Addis Chamber",
      contactPerson: "Meron Tadesse",
      email: "info@addischamber.org",
      phone: "+251 94 567 8901",
      tinNumber: "0045678901",
      status: "approved",
      registrationDate: "Jan 25, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=AC",
    },
    {
      id: "ORG005",
      name: "iceaddis",
      contactPerson: "Bereket Solomon",
      email: "hello@iceaddis.org",
      phone: "+251 95 678 9012",
      tinNumber: "0056789012",
      status: "pending",
      registrationDate: "Apr 5, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=IA",
    },
    {
      id: "ORG006",
      name: "Abyssinia Events",
      contactPerson: "Abebe Kebede",
      email: "info@abyssiniaevents.com",
      phone: "+251 96 789 0123",
      tinNumber: "0067890123",
      status: "pending",
      registrationDate: "May 10, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=AE",
    },
    {
      id: "ORG007",
      name: "Habesha Promotions",
      contactPerson: "Tigist Alemu",
      email: "contact@habeshapromotions.com",
      phone: "+251 97 890 1234",
      tinNumber: "0078901234",
      status: "rejected",
      registrationDate: "May 8, 2024",
      logo: "/placeholder.svg?height=40&width=40&text=HP",
    },
  ]

  // Filter organizations based on search term and status
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || org.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage event organizer organizations</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export List
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization List</CardTitle>
              <CardDescription>View and manage all registered organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>TIN Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No organizations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={org.logo || "/placeholder.svg"} alt={org.name} />
                                <AvatarFallback>{org.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{org.name}</p>
                                <p className="text-xs text-muted-foreground">{org.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{org.contactPerson}</TableCell>
                          <TableCell>{org.tinNumber}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                org.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : org.status === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }
                            >
                              {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{org.registrationDate}</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedOrg(org)
                                    setViewDocuments(false)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                                <DialogHeader>
                                  <DialogTitle>Organization Details</DialogTitle>
                                  <DialogDescription>
                                    View detailed information about this organization
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedOrg && (
                                  <div className="grid gap-6 py-4 overflow-y-auto pr-2">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarImage
                                          src={selectedOrg.logo || "/placeholder.svg"}
                                          alt={selectedOrg.name}
                                        />
                                        <AvatarFallback className="text-lg">
                                          {selectedOrg.name.substring(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-xl font-semibold">{selectedOrg.name}</h3>
                                        <p className="text-sm text-muted-foreground">ID: {selectedOrg.id}</p>
                                        <Badge
                                          className={
                                            selectedOrg.status === "approved"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2"
                                              : selectedOrg.status === "rejected"
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mt-2"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mt-2"
                                          }
                                        >
                                          {selectedOrg.status.charAt(0).toUpperCase() + selectedOrg.status.slice(1)}
                                        </Badge>
                                      </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                                        <div className="space-y-2">
                                          <div>
                                            <Label className="text-xs text-muted-foreground">Contact Person</Label>
                                            <p className="text-sm">{selectedOrg.contactPerson}</p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">Email</Label>
                                            <p className="text-sm">{selectedOrg.email}</p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">Phone</Label>
                                            <p className="text-sm">{selectedOrg.phone}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium mb-2">Business Information</h4>
                                        <div className="space-y-2">
                                          <div>
                                            <Label className="text-xs text-muted-foreground">TIN Number</Label>
                                            <p className="text-sm">{selectedOrg.tinNumber}</p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">Registration Date</Label>
                                            <p className="text-sm">{selectedOrg.registrationDate}</p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">Business Type</Label>
                                            <p className="text-sm">Event Organizer</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <Separator />

                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium">Verification Documents</h4>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setViewDocuments(!viewDocuments)}
                                        >
                                          {viewDocuments ? "Hide Documents" : "View Documents"}
                                        </Button>
                                      </div>

                                      {viewDocuments && (
                                        <div
                                          className={`mt-4 ${window.innerWidth >= 768 ? "md:grid md:grid-cols-2" : ""} gap-4 max-h-[400px] overflow-y-auto pr-2`}
                                        >
                                          {[
                                            {
                                              title: "Business Registration Certificate",
                                              type: "document",
                                            },
                                            {
                                              title: "Tax Identification Certificate",
                                              type: "document",
                                            },
                                            {
                                              title: "Company Ownership Document",
                                              type: "document",
                                            },
                                            {
                                              title: "Valid ID of Business Owner",
                                              type: "document",
                                            },
                                          ].map((doc, index) => (
                                            <Card key={index} className="mb-4">
                                              <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                  <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
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
                                                  {doc.title}
                                                </CardTitle>
                                              </CardHeader>
                                              <CardContent className="py-2">
                                                <div className="bg-muted h-32 rounded flex items-center justify-center">
                                                  <p className="text-sm text-muted-foreground">Document Preview</p>
                                                </div>
                                                <div className="flex justify-end mt-3">
                                                  <Button variant="outline" size="sm">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Download
                                                  </Button>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <DialogFooter className="flex justify-between mt-4 pt-2 border-t">
                                  {selectedOrg?.status === "pending" ? (
                                    <>
                                      <Button variant="destructive">
                                        <X className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button>
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                    </>
                                  ) : (
                                    <Button variant="outline">Close</Button>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>View Documents</DropdownMenuItem>
                                <DropdownMenuItem>Edit Organization</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {org.status === "approved" ? (
                                  <DropdownMenuItem className="text-red-600">Revoke Approval</DropdownMenuItem>
                                ) : org.status === "pending" ? (
                                  <>
                                    <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                                  </>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">Reconsider</DropdownMenuItem>
                                )}
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Organizations</CardTitle>
              <CardDescription>Organizations awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>TIN Number</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.filter((org) => org.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No pending organizations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      organizations
                        .filter((org) => org.status === "pending")
                        .map((org) => (
                          <TableRow key={org.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={org.logo || "/placeholder.svg"} alt={org.name} />
                                  <AvatarFallback>{org.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{org.name}</p>
                                  <p className="text-xs text-muted-foreground">{org.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{org.contactPerson}</TableCell>
                            <TableCell>{org.tinNumber}</TableCell>
                            <TableCell>{org.registrationDate}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                  <Eye className="h-3 w-3" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                  <Check className="h-3 w-3" />
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1 text-red-600">
                                  <X className="h-3 w-3" />
                                  Reject
                                </Button>
                              </div>
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
