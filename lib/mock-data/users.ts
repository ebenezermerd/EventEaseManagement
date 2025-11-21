export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'organizer' | 'attendee'
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  lastLogin?: string
  avatar?: string
  phone?: string
  emailVerified: boolean
}

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Abebe Kebede',
    email: 'abebe@example.com',
    role: 'admin',
    status: 'active',
    joinDate: 'Jan 15, 2024',
    lastLogin: 'Nov 20, 2024',
    avatar: '/placeholder-user.jpg',
    phone: '+251 91 123 4567',
    emailVerified: true,
  },
  {
    id: 'U002',
    name: 'Sara Mohammed',
    email: 'sara@example.com',
    role: 'organizer',
    status: 'active',
    joinDate: 'Feb 3, 2024',
    lastLogin: 'Nov 21, 2024',
    avatar: '/placeholder-user.jpg',
    phone: '+251 91 234 5678',
    emailVerified: true,
  },
  {
    id: 'U003',
    name: 'Daniel Tesfaye',
    email: 'daniel@example.com',
    role: 'attendee',
    status: 'active',
    joinDate: 'Feb 10, 2024',
    lastLogin: 'Nov 19, 2024',
    avatar: '/placeholder-user.jpg',
    phone: '+251 91 345 6789',
    emailVerified: true,
  },
  {
    id: 'U004',
    name: 'Meron Tadesse',
    email: 'meron@example.com',
    role: 'organizer',
    status: 'active',
    joinDate: 'Mar 5, 2024',
    lastLogin: 'Nov 18, 2024',
    avatar: '/placeholder-user.jpg',
    phone: '+251 91 456 7890',
    emailVerified: true,
  },
  {
    id: 'U005',
    name: 'Yonas Haile',
    email: 'yonas@example.com',
    role: 'attendee',
    status: 'active',
    joinDate: 'Mar 12, 2024',
    lastLogin: 'Nov 21, 2024',
    avatar: '/placeholder-user.jpg',
    emailVerified: true,
  },
]

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role)
}

export const getUsersByStatus = (status: User['status']): User[] => {
  return mockUsers.filter(user => user.status === status)
}
