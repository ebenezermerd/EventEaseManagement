import { FlaskConical } from "lucide-react"

// Marks dashboard pages that still render illustrative numbers instead of live data.
export function SampleDataNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-semibold">Sample data.</span>{" "}
        {children || "This page shows illustrative figures and is not connected to live bookings yet."}
      </p>
    </div>
  )
}
