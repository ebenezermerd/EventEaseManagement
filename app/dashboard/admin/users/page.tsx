"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { useAuth } from "@/contexts/AuthContext"
import { api, formatEventDate, type ApiUser } from "@/lib/api"

interface AdminUser extends ApiUser {
  lastLogin?: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page), limit: "20", role })
    if (search) qs.set("search", search)
    api<{ users: AdminUser[]; pagination: { total: number } }>(`/api/admin/users?${qs}`)
      .then((d) => {
        setUsers(d.users)
        setTotal(d.pagination.total)
      })
      .catch((e) => setError(e.message))
  }, [page, role, search])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const toggle = async (u: AdminUser) => {
    const status = u.status === "active" ? "inactive" : "active"
    try {
      await api(`/api/admin/users/${u.id}/status`, { method: "PUT", body: { status } })
      toast({ title: `${u.name} is now ${status}` })
      load()
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : "", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">{total} accounts on the platform</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="sm:max-w-sm" />
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1) }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-48"
          aria-label="Role"
        >
          <option value="all">All roles</option>
          <option value="attendee">Attendees</option>
          <option value="organizer">Organizers</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!users && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
      {users && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatEventDate(u.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.status || "active"} />
                    </TableCell>
                    <TableCell className="text-right">
                      {u.id !== me?.id && (
                        <Button size="sm" variant="outline" onClick={() => toggle(u)}>
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {total > 20 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
          <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}
