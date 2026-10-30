import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CalendarDays, ChevronRight, Clock, Globe, MapPin, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EventCard } from "@/components/events/event-card"
import { BookingPanel } from "@/components/events/booking-panel"
import { apiServer, formatEventDate, imageSrc, type EventItem } from "@/lib/api"

export const dynamic = "force-dynamic"

type Params = Promise<{ id: string }>

async function loadEvent(id: string) {
  const data = await apiServer<{ event: EventItem }>(`/api/events/${encodeURIComponent(id)}`, 0)
  return data?.event ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const event = await loadEvent((await params).id)
  return event ? { title: `${event.title} | EventEase`, description: event.description } : { title: "Event | EventEase" }
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const event = await loadEvent(id)
  if (!event) notFound()

  const related = await apiServer<{ events: EventItem[] }>(
    `/api/events?category=${encodeURIComponent(event.category)}&limit=4`,
    120,
  )
  const relatedEvents = (related?.events ?? []).filter((e) => e.id !== event.id).slice(0, 3)
  const paragraphs = (event.longDescription || event.description).split(/\n+/).filter(Boolean)

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="relative h-[280px] w-full md:h-[380px]">
          <Image src={imageSrc(event.image)} alt={event.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="container absolute bottom-0 left-0 right-0 pb-8 text-white">
            <nav className="mb-3 flex items-center gap-1 text-sm text-white/80">
              <Link href="/events" className="hover:text-white">
                Events
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>{event.category}</span>
            </nav>
            <h1 className="max-w-3xl text-3xl font-bold md:text-5xl">{event.title}</h1>
            {event.organizer && <p className="mt-2 text-white/80">by {event.organizer.companyName}</p>}
          </div>
        </div>

        <div className="container grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {event.approvalStatus !== "approved" && (
              <Badge variant="destructive" className="capitalize">
                {event.approvalStatus}
              </Badge>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{formatEventDate(event.date, { weekday: "long", month: "long" })}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {event.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.address}, {event.region}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <section>
              <h2 className="mb-3 text-2xl font-semibold">About this event</h2>
              <div className="space-y-3 text-muted-foreground">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> {event.attendees} people have booked
              </p>
            </section>

            {event.schedule && event.schedule.length > 0 && (
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Schedule</h2>
                <ol className="space-y-3 border-l pl-6">
                  {event.schedule.map((item, i) => (
                    <li key={i}>
                      <p className="text-sm font-medium text-primary">{item.time}</p>
                      <p className="font-medium">{item.title}</p>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {event.faqs && event.faqs.length > 0 && (
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Questions</h2>
                <Accordion type="single" collapsible>
                  {event.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {event.organizer && (
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Organizer</h2>
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold">{event.organizer.companyName}</p>
                    {event.organizer.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{event.organizer.description}</p>
                    )}
                    {event.organizer.website && (
                      <a
                        href={event.organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" /> Website
                      </a>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingPanel event={event} />
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="bg-muted/40 py-12">
            <div className="container">
              <h2 className="mb-6 text-2xl font-semibold">More {event.category} events</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
