import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatEventDate, imageSrc, type EventItem } from "@/lib/api"

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group h-full overflow-hidden border transition-colors hover:border-primary/20">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageSrc(event.image)}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            <Badge className="bg-primary/80 hover:bg-primary">{event.category}</Badge>
            {event.featured && (
              <Badge variant="secondary" className="bg-yellow-500/80 hover:bg-yellow-500">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="mb-2 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">{event.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-primary/70" />
              <span>
                {formatEventDate(event.date)} · {event.time}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-primary/70" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 shrink-0 text-primary/70" />
              <span>{event.attendees} booked</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-lg font-semibold text-primary">{event.price}</span>
            <Button className="text-xs" variant="outline">
              View details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
