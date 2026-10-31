import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  active: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "checked-in": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  draft: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("border-0 capitalize", STYLES[status] || "bg-muted")}>
      {status.replace("-", " ")}
    </Badge>
  )
}
