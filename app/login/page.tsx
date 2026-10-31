"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, Loader2, ShieldCheck, Ticket, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Public demo accounts created by api/scripts/seed.js. They are meant to be shared.
const DEMO_PASSWORD = "EventEase2026"
const DEMO_ACCOUNTS = [
  { label: "Attendee", email: "demo-attendee@eventease.app", icon: Ticket, hint: "Browse and book free events" },
  { label: "Organizer", email: "demo-organizer@eventease.app", icon: CalendarPlus, hint: "Create events, see attendees" },
  { label: "Admin", email: "demo-admin@eventease.app", icon: ShieldCheck, hint: "Approve organizers, list users" },
]

export default function LoginPage() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [next, setNext] = useState<string | null>(null)

  useEffect(() => {
    setNext(new URLSearchParams(window.location.search).get("next"))
  }, [])

  const signIn = async (emailValue: string, passwordValue: string) => {
    setIsLoading(true)
    try {
      const user = await login(emailValue, passwordValue, next)
      toast({ title: `Welcome, ${user.name.split(" ")[0]}`, description: "You are signed in." })
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your email and password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn(email, password)
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in as an attendee, organizer or admin</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                New to EventEase?{" "}
                <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Try a demo account</CardTitle>
            <CardDescription>
              All three use the password <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{DEMO_PASSWORD}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_ACCOUNTS.map(({ label, email: demoEmail, icon: Icon, hint }) => (
              <button
                key={demoEmail}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setEmail(demoEmail)
                  setPassword(DEMO_PASSWORD)
                  signIn(demoEmail, DEMO_PASSWORD)
                }}
                className="flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-muted disabled:opacity-60"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block truncate font-mono text-xs text-muted-foreground">{demoEmail}</span>
                </span>
                <span className="hidden text-xs text-muted-foreground sm:block">{hint}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
