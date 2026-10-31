"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { api } from "@/lib/api"

export interface AdminOrganizer {
  userId: string
  companyName: string
  description?: string | null
  website?: string | null
  region?: string | null
  tinNumber: string
  approvalStatus: "pending" | "approved" | "rejected"
  totalEvents: number
  createdAt: string
  user: { id: string; name: string; email: string; phone?: string | null }
}

// Organizer list with approve and reject actions, filtered by status.
export function OrganizerTable({ status }: { status: "pending" | "all" }) {
  const [organizers, setOrganizers] = useState<AdminOrganizer[] | null>(null)
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    const qs = new URLSearchParams({ status })
    if (search) qs.set("search", search)
    api<{ organizers: AdminOrganizer[] }>(`/api/admin/organizers?${qs}`)
      .then((d) => setOrganizers(d.organizers))
      .catch((e) => setError(e.message))
  }, [status, search])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const decide = async (o: AdminOrganizer, decision: "approved" | "rejected") => {
    let reason: string | undefined
    if (decision === "rejected") {
      reason = window.prompt(`Why is ${o.companyName} rejected?`) || undefined
      if (!reason) return
    }
    try {
      await api(`/api/admin/organizers/${o.userId}/status`, { method: "PUT", body: { status: decision, reason } })
      toast({ title: `${o.companyName} ${decision}` })
      load()
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : "", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Search company or email" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!organizers && !error && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
      {organizers && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">TIN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {status === "pending" ? "No applications waiting. New organizer sign ups appear here." : "No organizers found."}
                    </TableCell>
                  </TableRow>
                )}
                {organizers.map((o) => (
                  <TableRow key={o.userId}>
                    <TableCell>
                      <p className="font-medium">{o.companyName}</p>
                      <p className="max-w-[280px] truncate text-xs text-muted-foreground">
                        {o.region || "Region not set"} · {o.totalEvents} events
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p>{o.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs lg:table-cell">{o.tinNumber}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.approvalStatus} />
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      {o.approvalStatus !== "approved" && (
                        <Button size="sm" onClick={() => decide(o, "approved")}>
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                      )}
                      {o.approvalStatus !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => decide(o, "rejected")}>
                          <X className="mr-1 h-4 w-4" /> Reject
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
    </div>
  )
}
