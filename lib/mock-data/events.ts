export interface Event {
  id: string
  title: string
  description: string
  longDescription?: string
  eventDate: string
  time: string
  location: string
  address: string
  region: string
  price: string
  category: string
  status: 'draft' | 'pending' | 'published' | 'cancelled'
  image: string
  gallery?: string[]
  organizerId: string
  organizerName: string
  organizerLogo?: string
  attendees: number
  maxAttendees?: number
  revenue: number
  expenses: number
  profit: number
  featured: boolean
  rating?: number
  reviewCount?: number
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Addis Tech Summit 2024',
    description: 'Join Ethiopia\'s largest technology conference featuring keynotes, workshops, and networking opportunities.',
    longDescription: 'The Addis Tech Summit 2024 is Ethiopia\'s premier technology conference bringing together innovators, entrepreneurs, and tech enthusiasts. Experience keynote speeches from industry leaders, hands-on workshops, and extensive networking opportunities.',
    eventDate: '2024-06-15',
    time: '9:00 AM - 6:00 PM',
    location: 'Millennium Hall',
    address: 'Millennium Hall, Bole Road',
    region: 'Addis Ababa',
    price: 'ETB 500 - 1,500',
    category: 'Conference',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Tech+Summit',
    gallery: [
      '/placeholder.svg?height=300&width=400&text=Gallery+1',
      '/placeholder.svg?height=300&width=400&text=Gallery+2',
      '/placeholder.svg?height=300&width=400&text=Gallery+3',
    ],
    organizerId: 'org_001',
    organizerName: 'Tech Association',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=TA',
    attendees: 320,
    maxAttendees: 500,
    revenue: 384000,
    expenses: 150000,
    profit: 234000,
    featured: true,
    rating: 4.8,
    reviewCount: 145,
  },
  {
    id: '2',
    title: 'Ethiopian Coffee Festival',
    description: 'Celebrate Ethiopia\'s coffee heritage with tastings, workshops, and cultural performances.',
    longDescription: 'Immerse yourself in the rich tradition of Ethiopian coffee culture. This festival features coffee tastings from various regions, traditional coffee ceremonies, barista workshops, and live cultural performances.',
    eventDate: '2024-05-22',
    time: '10:00 AM - 8:00 PM',
    location: 'Friendship Park',
    address: 'Friendship Park, Bole',
    region: 'Addis Ababa',
    price: 'ETB 300',
    category: 'Festival',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Coffee+Festival',
    gallery: [
      '/placeholder.svg?height=300&width=400&text=Coffee+1',
      '/placeholder.svg?height=300&width=400&text=Coffee+2',
    ],
    organizerId: 'org_002',
    organizerName: 'Coffee Exporters',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=CE',
    attendees: 185,
    maxAttendees: 300,
    revenue: 55500,
    expenses: 25000,
    profit: 30500,
    featured: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    title: 'Cultural Heritage Exhibition',
    description: 'Explore Ethiopia\'s rich cultural heritage through art, artifacts, and interactive displays.',
    longDescription: 'A comprehensive exhibition showcasing Ethiopia\'s diverse cultural heritage, featuring ancient artifacts, contemporary art, traditional crafts, and interactive displays that bring history to life.',
    eventDate: '2024-05-28',
    time: '11:00 AM - 7:00 PM',
    location: 'National Museum',
    address: 'National Museum, King George VI Street',
    region: 'Addis Ababa',
    price: 'ETB 200',
    category: 'Exhibition',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Cultural+Exhibition',
    organizerId: 'org_003',
    organizerName: 'National Museum',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=NM',
    attendees: 156,
    maxAttendees: 200,
    revenue: 31200,
    expenses: 12000,
    profit: 19200,
    featured: false,
    rating: 4.7,
    reviewCount: 62,
  },
  {
    id: '4',
    title: 'Business Networking Mixer',
    description: 'Connect with business leaders and entrepreneurs in an exclusive networking environment.',
    longDescription: 'An exclusive evening networking event designed for business professionals, entrepreneurs, and investors. Features keynote speeches, breakout sessions, and ample networking opportunities.',
    eventDate: '2024-06-05',
    time: '6:00 PM - 10:00 PM',
    location: 'Hyatt Regency',
    address: 'Hyatt Regency, Meskel Square',
    region: 'Addis Ababa',
    price: 'ETB 800',
    category: 'Networking',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Networking+Mixer',
    organizerId: 'org_004',
    organizerName: 'Addis Chamber',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=AC',
    attendees: 95,
    maxAttendees: 150,
    revenue: 76000,
    expenses: 35000,
    profit: 41000,
    featured: true,
    rating: 4.5,
    reviewCount: 38,
  },
  {
    id: '5',
    title: 'Music Festival 2024',
    description: 'Experience live performances from top Ethiopian and international artists.',
    longDescription: 'A spectacular music festival featuring performances from renowned Ethiopian artists and international acts. Multiple stages, food vendors, and an unforgettable atmosphere.',
    eventDate: '2024-07-10',
    time: '4:00 PM - 11:00 PM',
    location: 'Meskel Square',
    address: 'Meskel Square, Addis Ababa',
    region: 'Addis Ababa',
    price: 'ETB 400 - 1,000',
    category: 'Music',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Music+Festival',
    organizerId: 'org_005',
    organizerName: 'Abyssinia Events',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=AE',
    attendees: 542,
    maxAttendees: 1000,
    revenue: 378000,
    expenses: 180000,
    profit: 198000,
    featured: true,
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: '6',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to investors and win funding.',
    longDescription: 'An exciting startup pitch competition where emerging entrepreneurs present their innovative business ideas to a panel of experienced investors and industry experts.',
    eventDate: '2024-06-20',
    time: '2:00 PM - 7:00 PM',
    location: 'iceaddis',
    address: 'iceaddis Innovation Hub, Bole',
    region: 'Addis Ababa',
    price: 'Free',
    category: 'Business',
    status: 'published',
    image: '/placeholder.svg?height=400&width=600&text=Startup+Pitch',
    organizerId: 'org_006',
    organizerName: 'iceaddis',
    organizerLogo: '/placeholder.svg?height=80&width=80&text=IA',
    attendees: 78,
    maxAttendees: 100,
    revenue: 0,
    expenses: 8000,
    profit: -8000,
    featured: false,
    rating: 4.4,
    reviewCount: 28,
  },
]

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id)
}

export const getEventsByCategory = (category: string): Event[] => {
  return mockEvents.filter(event => event.category === category)
}

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.featured)
}

export const getEventsByOrganizer = (organizerId: string): Event[] => {
  return mockEvents.filter(event => event.organizerId === organizerId)
}

export const getUpcomingEvents = (): Event[] => {
  const now = new Date()
  return mockEvents.filter(event => new Date(event.eventDate) > now)
}

export const getPastEvents = (): Event[] => {
  const now = new Date()
  return mockEvents.filter(event => new Date(event.eventDate) <= now)
}
