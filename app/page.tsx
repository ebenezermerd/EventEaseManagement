import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, BarChart3, Shield, Users, Zap, CalendarDays, Clock, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section - Next Level Advanced UI/UX */}
        <section className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40 h-screen">
          {/* Animated Gradient Mesh Background */}
          <div className="absolute inset-0 -z-20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-indigo-950/20"></div>
            
            {/* Animated Mesh Gradient Orbs */}
            <div className="absolute top-0 left-0 w-full h-screen overflow-visible">
              <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-transparent dark:from-purple-600/20 dark:via-pink-600/10 blur-3xl animate-pulse-slow"></div>
              <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-400/25 via-blue-400/15 to-transparent dark:from-cyan-600/15 dark:via-blue-600/10 blur-3xl animate-pulse-slower"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-400/20 via-violet-400/10 to-transparent dark:from-indigo-600/10 dark:via-violet-600/5 blur-3xl animate-pulse-medium"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-purple-500/40 rounded-full blur-sm animate-float-slow"></div>
            <div className="absolute top-[25%] right-[15%] w-2 h-2 bg-cyan-500/40 rounded-full blur-sm animate-float-fast"></div>
            <div className="absolute top-[45%] left-[20%] w-4 h-4 bg-pink-500/30 rounded-full blur-sm animate-float-medium"></div>
            <div className="absolute top-[60%] right-[25%] w-3 h-3 bg-indigo-500/40 rounded-full blur-sm animate-float-slower"></div>
            <div className="absolute top-[70%] left-[40%] w-2 h-2 bg-violet-500/40 rounded-full blur-sm animate-float-slow"></div>
            <div className="absolute top-[35%] right-[35%] w-3 h-3 bg-blue-500/30 rounded-full blur-sm animate-float-fast"></div>
          </div>

          {/* 3D Event Images with Advanced Styling */}
          <div className="absolute right-[2%] top-1/2 -translate-y-1/2 hidden xl:block z-10 w-[45%] max-w-[550px]">
            <div className="relative h-[650px] perspective-1000">
              {/* First Circle - Top Left */}
              <div className="absolute top-[-40px] right-[15%] w-72 h-72 group">
                <div className="relative w-full h-full rounded-full shadow-2xl overflow-hidden transform transition-all duration-70000 hover:scale-110 hover:rotate-3 animate-float-slow">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-transparent dark:from-cyan-500/30 dark:via-blue-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white/60 dark:border-white/30 shadow-inner backdrop-blur-sm">
                    <Image
                      src="/assets/image (8).jpg?height=300&width=300&text=Conference"
                      alt="Event Speaker"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-125"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  </div>
                </div>
              </div>

              {/* Second Circle - Center */}
              <div className="absolute top-[100px] right-[8%] w-96 h-96 group z-20">
                <div className="relative w-full h-full rounded-full shadow-2xl overflow-hidden transform transition-all duration-70000 hover:scale-110 hover:-rotate-2 animate-float-medium">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-pink-500/30 to-transparent dark:from-purple-500/30 dark:via-pink-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white/70 dark:border-white/40 shadow-inner backdrop-blur-sm">
                    <Image
                      src="/assets/hero-first.jpg?height=400&width=400&text=Music+Event"
                      alt="Music Event"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-125"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>

              {/* Third Circle - Bottom Right */}
              <div className="absolute top-[350px] right-[18%] w-64 h-64 group">
                <div className="relative w-full h-full rounded-full shadow-2xl overflow-hidden transform transition-all duration-70000 hover:scale-110 hover:rotate-6 animate-float-fast">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-transparent dark:from-indigo-500/30 dark:via-violet-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white/60 dark:border-white/30 shadow-inner backdrop-blur-sm">
                    <Image
                      src="/assets/image (11).jpg?height=250&width=250&text=Workshop"
                      alt="Workshop"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-125"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl xl:max-w-4xl">
              {/* Badge with shimmer effect */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 mb-6 backdrop-blur-sm animate-shimmer-slow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Discover Amazing Events
                </span>
              </div>

              {/* Main Headline with Advanced Typography */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
                <span className="block text-gray-900 dark:text-white drop-shadow-sm">
                  Find Your Next
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 animate-gradient-x">
                  Experience
                </span>
              </h1>

              {/* Subtitle with better readability */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 leading-relaxed font-medium">
                Discover and attend the best events in Ethiopia. From tech summits to cultural festivals, find what excites you.
              </p>

              {/* Advanced Search Bar with Glass Morphism */}
              <div className="relative group">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20">
                  <div className="flex flex-col md:flex-row">
                    {/* Search Input */}
                    <div className="flex-1 flex items-center px-6 py-5 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50 group/search">
                      <Search className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mr-3 transition-transform group-hover/search:scale-110" />
                      <input
                        placeholder="Search events..."
                        className="w-full bg-transparent border-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-0 text-base font-medium"
                      />
                    </div>

                    {/* Location Select */}
                    <div className="md:w-[200px] px-6 py-5 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50">
                      <Select>
                        <SelectTrigger className="border-0 bg-transparent focus:ring-0 shadow-none p-0 h-auto w-full">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 flex-shrink-0" />
                            <SelectValue placeholder="Location" className="text-gray-900 dark:text-white" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
                          <SelectItem value="addis">Addis Ababa</SelectItem>
                          <SelectItem value="hawassa">Hawassa</SelectItem>
                          <SelectItem value="bahirdar">Bahir Dar</SelectItem>
                          <SelectItem value="mekele">Mekele</SelectItem>
                          <SelectItem value="other">Other Locations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Select */}
                    <div className="md:w-[200px] px-6 py-5 border-b md:border-b-0 border-gray-200/50 dark:border-gray-700/50">
                      <Select>
                        <SelectTrigger className="border-0 bg-transparent focus:ring-0 shadow-none p-0 h-auto w-full">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 flex-shrink-0" />
                            <SelectValue placeholder="Category" className="text-gray-900 dark:text-white" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="music">Music & Entertainment</SelectItem>
                          <SelectItem value="sports">Sports & Fitness</SelectItem>
                          <SelectItem value="education">Education & Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search Button */}
                    <div className="p-2">
                      <Button
                        size="lg"
                        className="w-full md:w-auto px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base group/btn border-0"
                      >
                        <Search className="h-5 w-5 mr-2 transition-transform group-hover/btn:rotate-90 duration-300" />
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats or Quick Actions */}
              <div className="mt-12 flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {i}K
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900 dark:text-white">4,000+ Active Users</p>
                    <p className="text-gray-600 dark:text-gray-400">Join the community</p>
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900 dark:text-white">5.0 Rating</p>
                    <p className="text-gray-600 dark:text-gray-400">From 2,000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Events</h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px]">
                Discover the hottest events happening across Ethiopia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  title: "Addis Tech Summit 2024",
                  date: "May 15, 2024",
                  time: "9:00 AM",
                  location: "Millennium Hall, Addis Ababa",
                  category: "Technology",
                  image: "/assets/image (15).jpg?height=300&width=500&text=Addis+Tech+Summit",
                },
                {
                  id: 2,
                  title: "Ethiopian Coffee Festival",
                  date: "May 22, 2024",
                  time: "10:00 AM",
                  location: "Friendship Park, Addis Ababa",
                  category: "Cultural",
                  image: "/assets/image (16).jpg?height=300&width=500&text=Coffee+Festival",
                },
                {
                  id: 3,
                  title: "Cultural Heritage Exhibition",
                  date: "May 28, 2024",
                  time: "2:00 PM",
                  location: "National Museum, Addis Ababa",
                  category: "Cultural",
                  image: "/assets/image (18).jpg?height=300&width=500&text=Cultural+Exhibition",
                },
              ].map((event, index) => (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={event.image || "/assets/image (22).jpg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary">{event.category}</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/events">
                <Button variant="outline" className="group">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <Badge variant="secondary" className="inline-block">
                  Core Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything you need for successful events
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EventEase provides all the essential tools for discovering, creating, and managing events in Ethiopia.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">AI-Powered Event Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Discover events tailored to your interests with our Google Gemini LLM-powered recommendation system.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Seamless Chapa Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Book tickets with ease using Ethiopia's leading payment gateway, supporting multiple payment methods.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <BarChart3 className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Gain valuable insights into event performance, attendee demographics, and engagement metrics.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 4 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <Shield className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Event Verification</h3>
                <p className="text-sm text-muted-foreground">
                  All events are verified by our team to ensure authenticity and quality for attendees.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 5 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Organizer Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Powerful tools for event creation, attendee management, and financial reporting.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Feature Card 6 */}
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 text-primary">
                  <Zap className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Shareable Event Links</h3>
                <p className="text-sm text-muted-foreground">
                  Generate and share event links across social media and messaging platforms to maximize reach.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary-400 to-secondary-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <Badge variant="secondary" className="inline-block">
                  Common Questions
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to the most common questions about EventEase.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is EventEase?</AccordionTrigger>
                  <AccordionContent>
                    EventEase is a mobile-first event management platform designed specifically for the Ethiopian
                    market. It leverages Google Gemini LLM for AI-powered recommendations and integrates Chapa Payment
                    for seamless transactions. The platform enables users to discover, book, and attend personalized
                    events, while providing organizers and administrators with robust tools for event creation,
                    analytics, and secure payment processing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I become an event organizer?</AccordionTrigger>
                  <AccordionContent>
                    To become an event organizer on EventEase, you need to register and provide some documentation for
                    verification, including your legal company name, TIN number, and company ownership documents. Once
                    submitted, our admin team will review your application and approve your organizer status, typically
                    within 2-3 business days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment methods are supported?</AccordionTrigger>
                  <AccordionContent>
                    EventEase integrates with Chapa Payment, which supports multiple payment methods including Telebirr,
                    Commercial Bank of Ethiopia (CBE), Dashen Bank, Awash Bank, and major credit/debit cards. This
                    ensures that attendees can pay using their preferred method, making the booking process seamless and
                    convenient.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How does the event approval process work?</AccordionTrigger>
                  <AccordionContent>
                    After creating an event, it goes through an approval process to ensure quality and authenticity. Our
                    admin team reviews the event details, including title, description, location, and any supporting
                    documents. Once approved, you'll receive a notification and can then generate a shareable link to
                    promote your event across various platforms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I get analytics for my events?</AccordionTrigger>
                  <AccordionContent>
                    Yes, EventEase provides comprehensive analytics for organizers. You can access detailed reports on
                    attendee demographics, ticket sales, engagement metrics, and financial performance. These insights
                    help you understand your audience better and optimize future events for greater success.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your event experience?
                </h2>
                <p className="max-w-[700px] opacity-90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of Ethiopians who are discovering and creating memorable events with EventEase.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <Link href="/register">
                  <Button className="bg-white text-primary hover:bg-primary-50 px-8 h-12 rounded-md">
                    Get Started Now
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 h-12 rounded-md">
                  Become an Organizer
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">
                  Event
                  <span className="bg-gradient-to-r from-secondary-400 to-secondary-600 bg-clip-text text-transparent">
                    Ease
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Simplifying event management in Ethiopia.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/events" className="text-muted-foreground hover:text-foreground">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-muted-foreground hover:text-foreground">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    Organizer Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EventEase. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">Made with ❤️ in Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
