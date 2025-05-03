"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("attendee")

  // Attendee form state
  const [attendeeFormData, setAttendeeFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  // Organizer form state
  const [organizerFormData, setOrganizerFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    companyName: "",
    tinNumber: "",
    description: "",
    website: "",
    address: "",
    region: "",
  })

const [files, setFiles] = useState<{
  logo: File | null;
  verificationDocuments: File[];
}>({
  logo: null,
  verificationDocuments: [],
})

  const handleAttendeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAttendeeFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOrganizerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrganizerFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target
    
    if (name === "logo" && fileList && fileList.length > 0) {
      setFiles((prev) => ({ ...prev, logo: fileList[0] }))
    } else if (name === "verificationDocuments" && fileList && fileList.length > 0) {
      const selectedFiles = Array.from(fileList)
      setFiles((prev) => ({ ...prev, verificationDocuments: selectedFiles }))
    }
  }

  const validateAttendeeForm = () => {
    const { name, email, password, confirmPassword } = attendeeFormData
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const validateOrganizerForm = () => {
    const { name, email, password, confirmPassword, companyName, tinNumber } = organizerFormData
    
    if (!name || !email || !password || !companyName || !tinNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return false
    }
    
    if (!files.verificationDocuments.length) {
      toast({
        title: "Error",
        description: "Please upload at least one verification document.",
        variant: "destructive",
      })
      return false
    }
    
    return true
  }

  const handleAttendeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAttendeeForm()) return
    
    setIsLoading(true)
    try {
      // Replace with actual API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...attendeeFormData,
          role: "attendee"
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
      
      toast({
        title: "Success",
        description: "Account created successfully.",
      })
      
      // Redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrganizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateOrganizerForm()) return
    
    setIsLoading(true)
    try {
      // Create form data for multipart/form-data submission
      const formData = new FormData()
      
      // Add all text fields
      Object.entries(organizerFormData).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, value)
        }
      })
      
      // Add role
      formData.append("role", "organizer")
      
      // Add files
      if (files.logo) {
        formData.append("logo", files.logo)
      }
      
      files.verificationDocuments.forEach((file, index) => {
        formData.append(`verificationDocuments`, file)
      })
      
      // Replace with actual API endpoint
      const response = await fetch("/api/organizers/apply", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
      
      toast({
        title: "Success",
        description: "Organizer application submitted successfully. Your account is under review.",
      })
      
      // Redirect to organizer dashboard (they'll see a pending status message)
      router.push("/dashboard/organizer")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="mx-auto w-full max-w-[800px] space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Choose your account type and fill in your details</p>
        </div>

        <Tabs defaultValue="attendee" value={userType} onValueChange={setUserType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendee">Attendee</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
          </TabsList>
          
          {/* Attendee Registration Form */}
          <TabsContent value="attendee">
            <Card>
              <form onSubmit={handleAttendeeSubmit}>
                <CardHeader>
                  <CardTitle>Register as an Attendee</CardTitle>
                  <CardDescription>
                    Create an account to discover and book events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendee-name">Full Name</Label>
                    <Input
                      id="attendee-name"
                      name="name"
                      placeholder="John Doe"
                      value={attendeeFormData.name}
                      onChange={handleAttendeeInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendee-email">Email</Label>
                    <Input
                      id="attendee-email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={attendeeFormData.email}
                      onChange={handleAttendeeInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendee-phone">Phone (Optional)</Label>
                    <Input
                      id="attendee-phone"
                      name="phone"
                      type="tel"
                      placeholder="+251 91 234 5678"
                      value={attendeeFormData.phone}
                      onChange={handleAttendeeInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendee-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="attendee-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={attendeeFormData.password}
                        onChange={handleAttendeeInputChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendee-confirm-password">Confirm Password</Label>
                    <Input
                      id="attendee-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={attendeeFormData.confirmPassword}
                      onChange={handleAttendeeInputChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Organizer Registration Form */}
          <TabsContent value="organizer">
            <Card>
              <form onSubmit={handleOrganizerSubmit}>
                <CardHeader>
                  <CardTitle>Apply as an Organizer</CardTitle>
                  <CardDescription>
                    Create an organizer account to host and manage events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="organizer-name">Contact Person Name</Label>
                      <Input
                        id="organizer-name"
                        name="name"
                        placeholder="John Doe"
                        value={organizerFormData.name}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-company">Company/Organization Name</Label>
                      <Input
                        id="organizer-company"
                        name="companyName"
                        placeholder="Event Masters Ltd."
                        value={organizerFormData.companyName}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-email">Email</Label>
                      <Input
                        id="organizer-email"
                        name="email"
                        type="email"
                        placeholder="contact@eventmasters.com"
                        value={organizerFormData.email}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-phone">Phone</Label>
                      <Input
                        id="organizer-phone"
                        name="phone"
                        type="tel"
                        placeholder="+251 91 234 5678"
                        value={organizerFormData.phone}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-website">Website (Optional)</Label>
                      <Input
                        id="organizer-website"
                        name="website"
                        type="url"
                        placeholder="https://eventmasters.com"
                        value={organizerFormData.website}
                        onChange={handleOrganizerInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-tin">TIN Number</Label>
                      <Input
                        id="organizer-tin"
                        name="tinNumber"
                        placeholder="123456789"
                        value={organizerFormData.tinNumber}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="organizer-address">Address</Label>
                      <Input
                        id="organizer-address"
                        name="address"
                        placeholder="123 Main St, Addis Ababa"
                        value={organizerFormData.address}
                        onChange={handleOrganizerInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="organizer-region">Region/City</Label>
                      <Input
                        id="organizer-region"
                        name="region"
                        placeholder="Addis Ababa"
                        value={organizerFormData.region}
                        onChange={handleOrganizerInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="organizer-description">Company Description</Label>
                      <Textarea
                        id="organizer-description"
                        name="description"
                        placeholder="Tell us about your organization..."
                        value={organizerFormData.description}
                        onChange={handleOrganizerInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-logo">Company Logo (Optional)</Label>
                      <Input
                        id="organizer-logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image (1:1 ratio), max 2MB
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-documents">Verification Documents</Label>
                      <Input
                        id="organizer-documents"
                        name="verificationDocuments"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={handleFileChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Business registration, license, or other verification documents. PDF or images, max 5MB each.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="organizer-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={organizerFormData.password}
                          onChange={handleOrganizerInputChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organizer-confirm-password">Confirm Password</Label>
                      <Input
                        id="organizer-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={organizerFormData.confirmPassword}
                        onChange={handleOrganizerInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <p className="text-sm text-muted-foreground">
                    By applying, you agree to our terms and conditions. Your application will be reviewed by our team.
                  </p>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
