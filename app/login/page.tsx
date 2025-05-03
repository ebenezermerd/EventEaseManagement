"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("attendee")

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const endpoint = userType === "organizer" 
      ? "/api/organizers/login" 
      : "/api/auth/login"

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage or secure cookie
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", userType)

      // Show success message
      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      // Redirect based on user type
      if (userType === "organizer") {
        // If organizer is not verified, show a different dashboard view
        const redirectPath = data.verified 
          ? "/dashboard/organizer" 
          : "/dashboard/organizer/pending"
        router.push(redirectPath)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Tabs defaultValue="attendee" value={userType} onValueChange={setUserType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendee">Attendee</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendee">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-center">Login as Attendee</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        placeholder="name@example.com" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input 
                          id="password" 
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange} 
                          required 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="organizer">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-center">Login as Organizer</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizer-email">Email</Label>
                      <Input 
                        id="organizer-email" 
                        name="email"
                        placeholder="organizer@example.com" 
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="organizer-password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input 
                          id="organizer-password" 
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange} 
                          required 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="organizer-remember"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <label
                        htmlFor="organizer-remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
