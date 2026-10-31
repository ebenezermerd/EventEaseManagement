"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronRight, LogOut, Settings, Home, Menu } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { roleHome } from "@/lib/api"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopNavProps {
  onMobileMenuToggle: () => void
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const pathname = usePathname()
  const { user, role, logout } = useAuth()
  const initials = (user?.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const home = roleHome(role)
    if (!pathname) return [{ label: "Dashboard", href: home }]

    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: home }]

    let currentPath = ""
    paths.forEach((path, index) => {
      // Skip "dashboard" and the role segment, both covered by the first crumb
      if (index === 0 && path === "dashboard") return
      if (index === 1 && ["admin", "organizer", "attendee"].includes(path)) {
        currentPath += `/dashboard/${path}`
        return
      }
      // Long ids are not meaningful labels
      if (path.length > 24) {
        currentPath += `/${path}`
        breadcrumbs.push({ label: "Details", href: currentPath })
        return
      }

      currentPath += index === 0 ? `/${path}` : `/${path}`
      breadcrumbs.push({
        label: (path.charAt(0).toUpperCase() + path.slice(1)).replace(/-/g, " "),
        href: currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-background border-b h-full">
      <div className="font-medium text-sm flex items-center space-x-1 truncate max-w-[300px]">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>

        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
            {index < breadcrumbs.length - 1 ? (
              <Link href={item.href || "#"} className="text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name || "Account"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-[280px] sm:w-80 p-0">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name || "Account"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || "Signed in"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  {role && <p className="text-xs capitalize text-primary">{role}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm">
                  <Home className="h-4 w-4" />
                  <span>Back to site</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
