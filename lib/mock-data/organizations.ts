export interface Organization {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  tinNumber: string
  status: 'approved' | 'pending' | 'rejected'
  registrationDate: string
  logo?: string
  website?: string
  description?: string
  address?: string
  region?: string
  verified: boolean
  followers: number
  totalEvents: number
}

export const mockOrganizations: Organization[] = [
  {
    id: 'org_001',
    name: 'Tech Association',
    contactPerson: 'Sara Mohammed',
    email: 'contact@techassociation.com',
    phone: '+251 91 234 5678',
    tinNumber: '0012345678',
    status: 'approved',
    registrationDate: 'Feb 3, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=TA',
    website: 'https://techassociation.com',
    description: 'Leading technology community in Ethiopia',
    address: 'Bole Road, Addis Ababa',
    region: 'Addis Ababa',
    verified: true,
    followers: 1250,
    totalEvents: 12,
  },
  {
    id: 'org_002',
    name: 'Coffee Exporters',
    contactPerson: 'Yonas Haile',
    email: 'info@coffeeexporters.com',
    phone: '+251 92 345 6789',
    tinNumber: '0023456789',
    status: 'approved',
    registrationDate: 'Apr 12, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=CE',
    website: 'https://coffeeexporters.com',
    description: 'Premium Ethiopian coffee exporters',
    address: 'Merkato, Addis Ababa',
    region: 'Addis Ababa',
    verified: true,
    followers: 890,
    totalEvents: 8,
  },
  {
    id: 'org_003',
    name: 'National Museum',
    contactPerson: 'Dawit Mekonnen',
    email: 'info@nationalmuseum.org',
    phone: '+251 93 456 7890',
    tinNumber: '0034567890',
    status: 'approved',
    registrationDate: 'Mar 8, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=NM',
    website: 'https://nationalmuseum.org',
    description: 'Ethiopia\'s premier cultural institution',
    address: 'King George VI Street',
    region: 'Addis Ababa',
    verified: true,
    followers: 2340,
    totalEvents: 15,
  },
  {
    id: 'org_004',
    name: 'Addis Chamber',
    contactPerson: 'Meron Tadesse',
    email: 'info@addischamber.org',
    phone: '+251 94 567 8901',
    tinNumber: '0045678901',
    status: 'approved',
    registrationDate: 'Jan 25, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=AC',
    website: 'https://addischamber.org',
    description: 'Addis Ababa Chamber of Commerce',
    address: 'Mexico Square',
    region: 'Addis Ababa',
    verified: true,
    followers: 3120,
    totalEvents: 24,
  },
  {
    id: 'org_005',
    name: 'Abyssinia Events',
    contactPerson: 'Abebe Kebede',
    email: 'info@abyssiniaevents.com',
    phone: '+251 96 789 0123',
    tinNumber: '0067890123',
    status: 'pending',
    registrationDate: 'May 10, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=AE',
    description: 'Professional event management company',
    address: 'Bole, Addis Ababa',
    region: 'Addis Ababa',
    verified: false,
    followers: 450,
    totalEvents: 3,
  },
  {
    id: 'org_006',
    name: 'iceaddis',
    contactPerson: 'Bereket Solomon',
    email: 'hello@iceaddis.org',
    phone: '+251 95 678 9012',
    tinNumber: '0056789012',
    status: 'approved',
    registrationDate: 'Apr 5, 2024',
    logo: '/placeholder.svg?height=80&width=80&text=IA',
    website: 'https://iceaddis.com',
    description: 'Innovation hub and startup incubator',
    address: 'Bole, Addis Ababa',
    region: 'Addis Ababa',
    verified: true,
    followers: 1890,
    totalEvents: 18,
  },
]

export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(org => org.id === id)
}

export const getOrganizationsByStatus = (status: Organization['status']): Organization[] => {
  return mockOrganizations.filter(org => org.status === status)
}

export const getVerifiedOrganizations = (): Organization[] => {
  return mockOrganizations.filter(org => org.verified)
}
