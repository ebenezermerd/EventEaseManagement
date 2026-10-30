import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify, decodeJwt } from "jose"

// Route guard for /dashboard. The API re-checks every request; this guard keeps
// signed out visitors and the wrong roles away from dashboard pages.
const TOKEN_COOKIE = "ee_token"
type Role = "admin" | "organizer" | "attendee"

const HOME: Record<Role, string> = {
  admin: "/dashboard/admin",
  organizer: "/dashboard/organizer",
  attendee: "/dashboard/attendee",
}

// Sections that belong to a single role. Settings and help are shared.
const SECTION_ROLE: [string, Role][] = [
  ["/dashboard/admin", "admin"],
  ["/dashboard/organizer", "organizer"],
  ["/dashboard/attendee", "attendee"],
]

async function readRole(token: string): Promise<Role | null> {
  try {
    const secret = process.env.JWT_SECRET
    const payload = secret
      ? (await jwtVerify(token, new TextEncoder().encode(secret))).payload
      : decodeJwt(token) // Without the shared secret, fall back to an expiry check only.
    if (!secret && typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) return null
    const role = payload.role as Role
    return role in HOME ? role : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const role = token ? await readRole(token) : null

  if (!role) {
    const login = new URL("/login", request.url)
    login.searchParams.set("next", pathname + search)
    const response = NextResponse.redirect(login)
    if (token) response.cookies.delete(TOKEN_COOKIE)
    return response
  }

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(new URL(HOME[role], request.url))
  }

  const section = SECTION_ROLE.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + "/"))
  if (section && section[1] !== role) {
    return NextResponse.redirect(new URL(HOME[role], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}
