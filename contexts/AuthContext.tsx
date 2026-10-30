"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api, getToken, roleHome, setToken, type ApiOrganizerSummary, type ApiUser, type Role } from "@/lib/api"

interface RegisterInput {
  name: string
  email: string
  password: string
  phone?: string
  role?: "attendee" | "organizer"
  companyName?: string
  tinNumber?: string
  description?: string
  website?: string
  address?: string
  region?: string
}

interface AuthContextType {
  user: ApiUser | null
  role: Role | null
  organizer: ApiOrganizerSummary | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, next?: string | null) => Promise<ApiUser>
  register: (input: RegisterInput) => Promise<ApiUser>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

interface AuthResponse {
  user: ApiUser
  organizer: ApiOrganizerSummary | null
  token: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<ApiUser | null>(null)
  const [organizer, setOrganizer] = useState<ApiOrganizerSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setOrganizer(null)
      setLoading(false)
      return
    }
    try {
      const data = await api<{ user: ApiUser; organizer: ApiOrganizerSummary | null }>("/api/auth/me")
      setUser(data.user)
      setOrganizer(data.organizer)
    } catch {
      setToken(null)
      setUser(null)
      setOrganizer(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const finish = useCallback(
    (data: AuthResponse, next?: string | null) => {
      setToken(data.token)
      setUser(data.user)
      setOrganizer(data.organizer)
      const home = roleHome(data.user.role)
      // Only follow `next` when it stays inside the dashboard area of this role.
      const target = next && next.startsWith(home) ? next : home
      router.push(target)
      router.refresh()
      return data.user
    },
    [router],
  )

  const login = useCallback(
    async (email: string, password: string, next?: string | null) => {
      const data = await api<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password }, auth: false })
      return finish(data, next)
    },
    [finish],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const path = input.role === "organizer" ? "/api/auth/organizer/register" : "/api/auth/register"
      const data = await api<AuthResponse>(path, { method: "POST", body: input, auth: false })
      return finish(data)
    },
    [finish],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setOrganizer(null)
    router.push("/login")
    router.refresh()
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        organizer,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
