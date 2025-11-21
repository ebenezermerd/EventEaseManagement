export interface TicketType {
  id: string
  eventId: string
  eventName: string
  name: string
  description?: string
  price: number
  currency: string
  quantity: number
  sold: number
  available: number
  status: 'On Sale' | 'Sold Out' | 'Paused'
  startDate?: string
  endDate?: string
  maxPerOrder?: number
  minPerOrder?: number
  type: 'general' | 'vip' | 'early' | 'group' | 'student'
}

export const mockTickets: TicketType[] = [
  {
    id: 'ticket_001',
    eventId: '1',
    eventName: 'Addis Tech Summit 2024',
    name: 'General Admission',
    description: 'Standard entry to the event with access to all general sessions.',
    price: 500,
    currency: 'ETB',
    quantity: 320,
    sold: 120,
    available: 200,
    status: 'On Sale',
    startDate: '2024-05-01',
    endDate: '2024-06-15',
    maxPerOrder: 5,
    minPerOrder: 1,
    type: 'general',
  },
  {
    id: 'ticket_002',
    eventId: '1',
    eventName: 'Addis Tech Summit 2024',
    name: 'VIP',
    description: 'Premium access with reserved seating and exclusive networking opportunities.',
    price: 1500,
    currency: 'ETB',
    quantity: 80,
    sold: 30,
    available: 50,
    status: 'On Sale',
    startDate: '2024-05-01',
    endDate: '2024-06-15',
    maxPerOrder: 2,
    minPerOrder: 1,
    type: 'vip',
  },
  {
    id: 'ticket_003',
    eventId: '2',
    eventName: 'Ethiopian Coffee Festival',
    name: 'General Admission',
    description: 'Standard entry to the coffee festival with tasting opportunities.',
    price: 300,
    currency: 'ETB',
    quantity: 300,
    sold: 185,
    available: 115,
    status: 'On Sale',
    startDate: '2024-05-10',
    endDate: '2024-05-22',
    maxPerOrder: 10,
    minPerOrder: 1,
    type: 'general',
  },
  {
    id: 'ticket_004',
    eventId: '3',
    eventName: 'Cultural Heritage Exhibition',
    name: 'Early Bird',
    description: 'Discounted early access tickets with special morning sessions.',
    price: 150,
    currency: 'ETB',
    quantity: 100,
    sold: 100,
    available: 0,
    status: 'Sold Out',
    startDate: '2024-04-15',
    endDate: '2024-05-20',
    maxPerOrder: 5,
    minPerOrder: 1,
    type: 'early',
  },
  {
    id: 'ticket_005',
    eventId: '5',
    eventName: 'Music Festival 2024',
    name: 'General Admission',
    description: 'Standing room access to all stages.',
    price: 400,
    currency: 'ETB',
    quantity: 800,
    sold: 542,
    available: 258,
    status: 'On Sale',
    maxPerOrder: 6,
    minPerOrder: 1,
    type: 'general',
  },
  {
    id: 'ticket_006',
    eventId: '5',
    eventName: 'Music Festival 2024',
    name: 'VIP Pass',
    description: 'VIP area access, complimentary drinks, and artist meet & greet.',
    price: 1000,
    currency: 'ETB',
    quantity: 200,
    sold: 145,
    available: 55,
    status: 'On Sale',
    maxPerOrder: 4,
    minPerOrder: 1,
    type: 'vip',
  },
]

export const getTicketsByEvent = (eventId: string): TicketType[] => {
  return mockTickets.filter(ticket => ticket.eventId === eventId)
}

export const getTicketById = (id: string): TicketType | undefined => {
  return mockTickets.find(ticket => ticket.id === id)
}

export const getAvailableTickets = (): TicketType[] => {
  return mockTickets.filter(ticket => ticket.available > 0)
}
