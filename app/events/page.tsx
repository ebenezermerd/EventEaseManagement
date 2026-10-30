import { Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdvancedPagination } from "@/components/advanced-pagination"
import { EventCard } from "@/components/events/event-card"
import { apiServer, type EventItem } from "@/lib/api"

export const dynamic = "force-dynamic"

interface EventsResponse {
  events: EventItem[]
  pagination: { total: number; page: number; limit: number; pages: number }
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || ""

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const page = Math.max(Number(one(params.page)) || 1, 1)
  const size = Math.min(Math.max(Number(one(params.size)) || 9, 3), 30)
  const search = one(params.search)
  const category = one(params.category)
  const location = one(params.location)
  const when = one(params.when) || "upcoming"

  const query = new URLSearchParams({ page: String(page), limit: String(size), when })
  if (search) query.set("search", search)
  if (category && category !== "all") query.set("category", category)
  if (location && location !== "all") query.set("location", location)

  const [data, filters] = await Promise.all([
    apiServer<EventsResponse>(`/api/events?${query}`, 30),
    apiServer<{ filters: { categories: string[]; regions: string[] } }>("/api/events/filters", 300),
  ])
  const events = data?.events ?? []
  const categories = filters?.filters.categories ?? []

  return (
    <>
      <SiteHeader />
      <main className="container min-h-screen py-10">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Discover Events</h1>
          <p className="mb-6 max-w-3xl text-muted-foreground">
            Find and book events across Ethiopia, from tech summits in Addis Ababa to coffee festivals in Hawassa.
          </p>

          <form method="get" className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_200px_200px_150px_auto]">
            <Input name="search" placeholder="Search events, venues or cities" defaultValue={search} />
            <select
              name="category"
              defaultValue={category || "all"}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Category"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Input name="location" placeholder="City or region" defaultValue={location === "all" ? "" : location} />
            <select
              name="when"
              defaultValue={when}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Date"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">Any date</option>
            </select>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>

        {!data && (
          <p className="rounded-lg border p-8 text-center text-muted-foreground">
            The event service is not reachable right now. Please refresh in a moment.
          </p>
        )}
        {data && events.length === 0 && (
          <p className="rounded-lg border p-8 text-center text-muted-foreground">No events match your search yet.</p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {data && data.pagination.total > size && (
          <div className="mt-12">
            <AdvancedPagination totalItems={data.pagination.total} itemsPerPage={size} currentPage={page} siblingsCount={1} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
