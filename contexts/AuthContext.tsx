"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Define the user types
type UserRole = "admin" | "organizer" | "attendee" | null
type OrganizerStatus = "pending" | "approved" | "rejected" | null

// Define the context value type
interface AuthContextType {
  user: any | null
  token: string | null
  role: UserRole
  organizerInfo: {
    status: OrganizerStatus
    verified: boolean
  } | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  checkIsAuthenticated: () => boolean
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  organizerInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  checkIsAuthenticated: () => false,
})

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  
  // State
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [organizerInfo, setOrganizerInfo] = useState<{
    status: OrganizerStatus
    verified: boolean
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      
      // Check for token in localStorage or cookie
      const storedToken = localStorage.getItem("token")
      const storedRole = localStorage.getItem("userRole") as UserRole
      
      if (storedToken) {
        try {
          // Call API to validate token and get user data
          const endpoint = storedRole === "organizer" 
            ? "/api/organizers/profile" 
            : "/api/auth/me"
            
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            
            // Set organizer info if applicable
            if (storedRole === "organizer" && data.organizer) {
              setOrganizerInfo({
                status: data.organizer.status,
                verified: data.organizer.verified
              })
            }
            
            setToken(storedToken)
            setRole(storedRole)
            setIsAuthenticated(true)
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("userRole")
            setIsAuthenticated(false)
          }
        } catch (err) {
          console.error("Auth initialization error:", err)
          setError("Authentication failed. Please log in again.")
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      
      setLoading(false)
    }
    
    initAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string, userRole: UserRole) => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoint = userRole === "organizer" 
        ? "/api/organizers/login" 
        : "/api/auth/login"
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }
      
      // Save user data
      setUser(data.user)
      setToken(data.token)
      setRole(userRole)
      setIsAuthenticated(true)
      
      // Save organizer info if applicable
      if (userRole === "organizer") {
        setOrganizerInfo({
          status: data.status,
          verified: data.verified
        })
      }
      
      // Store token and role
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", userRole || "")
      
      // Redirect based on user role and status
      if (userRole === "organizer") {
        const redirectPath = data.verified 
          ? "/dashboard/organizer" 
          : "/dashboard/organizer/pending"
        router.push(redirectPath)
      } else if (userRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }
  
  // Logout function
  const logout = () => {
    // Clear state
    setUser(null)
    setToken(null)
    setRole(null)
    setOrganizerInfo(null)
    setIsAuthenticated(false)
    
    // Clear storage
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    
    // Redirect to login
    router.push("/login")
  }
  
  // Check if user is authenticated
  const checkIsAuthenticated = () => {
    return isAuthenticated
  }
  
  // Context value
  const value = {
    user,
    token,
    role,
    organizerInfo,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkIsAuthenticated,
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext 