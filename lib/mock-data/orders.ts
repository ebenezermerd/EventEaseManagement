export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  event: {
    id: string
    name: string
    date: string
  }
  orderDate: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled' | 'refunded'
  paymentMethod: string
  tickets: Array<{
    type: string
    quantity: number
    price: number
  }>
}

export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    orderNumber: '#ORD20241234',
    customer: {
      name: 'Kidist Hailu',
      email: 'kidist.hailu@example.com',
      avatar: '/placeholder-user.jpg',
    },
    event: {
      id: '2',
      name: 'Ethiopian Coffee Festival',
      date: 'May 22, 2024',
    },
    orderDate: 'May 2, 2024',
    amount: 1250,
    status: 'completed',
    paymentMethod: 'Telebirr',
    tickets: [
      {
        type: 'General Admission',
        quantity: 3,
        price: 300,
      },
      {
        type: 'VIP',
        quantity: 1,
        price: 350,
      },
    ],
  },
  {
    id: 'ord_002',
    orderNumber: '#ORD20245678',
    customer: {
      name: 'Abel Tesfaye',
      email: 'abel.tesfaye@example.com',
      avatar: '/placeholder-user.jpg',
    },
    event: {
      id: '1',
      name: 'Addis Tech Summit 2024',
      date: 'Jun 15, 2024',
    },
    orderDate: 'May 3, 2024',
    amount: 1000,
    status: 'pending',
    paymentMethod: 'CBE Birr',
    tickets: [
      {
        type: 'General Admission',
        quantity: 2,
        price: 500,
      },
    ],
  },
  {
    id: 'ord_003',
    orderNumber: '#ORD20249012',
    customer: {
      name: 'Sara Mohammed',
      email: 'sara.mohammed@example.com',
      avatar: '/placeholder-user.jpg',
    },
    event: {
      id: '5',
      name: 'Music Festival 2024',
      date: 'Jul 10, 2024',
    },
    orderDate: 'May 5, 2024',
    amount: 2400,
    status: 'completed',
    paymentMethod: 'Chapa',
    tickets: [
      {
        type: 'VIP Pass',
        quantity: 2,
        price: 1000,
      },
      {
        type: 'General Admission',
        quantity: 1,
        price: 400,
      },
    ],
  },
  {
    id: 'ord_004',
    orderNumber: '#ORD20243456',
    customer: {
      name: 'Dawit Alemu',
      email: 'dawit.alemu@example.com',
      avatar: '/placeholder-user.jpg',
    },
    event: {
      id: '1',
      name: 'Addis Tech Summit 2024',
      date: 'Jun 15, 2024',
    },
    orderDate: 'May 8, 2024',
    amount: 1500,
    status: 'completed',
    paymentMethod: 'Telebirr',
    tickets: [
      {
        type: 'VIP',
        quantity: 1,
        price: 1500,
      },
    ],
  },
  {
    id: 'ord_005',
    orderNumber: '#ORD20247890',
    customer: {
      name: 'Tigist Bekele',
      email: 'tigist.bekele@example.com',
      avatar: '/placeholder-user.jpg',
    },
    event: {
      id: '3',
      name: 'Cultural Heritage Exhibition',
      date: 'May 28, 2024',
    },
    orderDate: 'May 12, 2024',
    amount: 600,
    status: 'refunded',
    paymentMethod: 'Chapa',
    tickets: [
      {
        type: 'Early Bird',
        quantity: 4,
        price: 150,
      },
    ],
  },
]

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id)
}

export const getOrdersByStatus = (status: Order['status']): Order[] => {
  return mockOrders.filter(order => order.status === status)
}

export const getOrdersByEvent = (eventId: string): Order[] => {
  return mockOrders.filter(order => order.event.id === eventId)
}

export const getRecentOrders = (limit: number = 10): Order[] => {
  return mockOrders.slice(0, limit)
}
