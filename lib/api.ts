// Client for the EventEase REST API (the Express app in /api).
// NEXT_PUBLIC_API_URL points at the deployed API, e.g. https://eventease-api.vercel.app

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "")

export type Role = "admin" | "organizer" | "attendee"

export interface ApiUser {
  id: string
  name: string
  email: string
  phone?: string | null
  role: Role
  avatar?: string | null
  status?: string
  joinDate?: string
}

export interface ApiOrganizerSummary {
  companyName: string
  description?: string | null
  website?: string | null
  region?: string | null
  approvalStatus: "pending" | "approved" | "rejected"
  verified: boolean
}

export interface TicketType {
  id: string
  name: string
  description?: string | null
  price: number
  currency: string
  quantity: number
  sold: number
  remaining: number
  available: boolean
  isFree: boolean
}

export interface EventItem {
  id: string
  title: string
  description: string
  longDescription?: string | null
  date: string
  eventDate: string
  time: string
  location: string
  address: string
  region: string
  category: string
  image?: string | null
  gallery: string[]
  price: string
  minPrice: number
  isFree: boolean
  attendees: number
  maxAttendees?: number | null
  featured: boolean
  approvalStatus: "draft" | "pending" | "approved" | "rejected" | "cancelled"
  organizerId: string
  organizer: { id: string; companyName: string; name: string; logo?: string | null; description?: string; website?: string } | null
  ticketTypes: TicketType[]
  schedule?: { time: string; title: string; description?: string; speaker?: string }[]
  faqs?: { question: string; answer: string }[]
  createdAt: string
}

export interface Booking {
  id: string
  bookingReference: string
  status: "pending" | "confirmed" | "cancelled" | "checked-in"
  quantity: number
  totalPrice: number
  currency: string
  createdAt: string
  checkedInAt?: string | null
  event: { id: string; title: string; date: string; time: string; location: string; region: string; image?: string | null } | null
  ticketType: { id: string; name: string; price: number } | null
  attendee?: { id: string; name: string; email: string; phone?: string | null }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  eventCount: number
}

export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const TOKEN_COOKIE = "ee_token"

export function getToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setToken(token: string | null) {
  if (typeof document === "undefined") return
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  if (token) {
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax${secure}`
  } else {
    document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
  }
}

type FetchOptions = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean }

export async function api<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options
  const token = auth ? getToken() : null
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Cannot reach the EventEase API. Please try again in a moment.", 0)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status, data.code)
  }
  return data as T
}

// Server side fetch for public data (no auth), revalidated every minute.
export async function apiServer<T = any>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function roleHome(role: Role | null | undefined) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "organizer") return "/dashboard/organizer"
  return "/dashboard/attendee"
}

export function formatEventDate(value: string | Date, opts: Intl.DateTimeFormatOptions = {}) {
  const date = typeof value === "string" ? new Date(value) : value
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Addis_Ababa",
    ...opts,
  })
}

export function formatBirr(amount: number) {
  return amount === 0 ? "Free" : `ETB ${amount.toLocaleString("en-US")}`
}

export function imageSrc(src?: string | null) {
  if (!src) return "/placeholder.jpg"
  return src.startsWith("http") ? src : encodeURI(src)
}
