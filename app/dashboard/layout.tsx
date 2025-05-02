"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [role, setRole] = useState<"admin" | "organizer" | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Determine role based on URL path
    if (pathname?.includes("/dashboard/admin")) {
      setRole("admin")
    } else if (pathname?.includes("/dashboard/organizer") || pathname === "/dashboard") {
      setRole("organizer")
    }
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={isMobileMenuOpen}
        onMobileOpenChange={setIsMobileMenuOpen}
      />
      <div
        className={`w-full flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        <header className="h-16 border-b">
          <TopNav onMobileMenuToggle={toggleMobileMenu} />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
