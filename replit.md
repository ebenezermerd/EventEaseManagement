# EventEase - Event Management Platform

## Overview
EventEase is a comprehensive event management platform built with Next.js, designed for the Ethiopian market. The platform connects event organizers with attendees, featuring event creation, ticket sales, payment processing, and analytics.

## Project Architecture

### Technology Stack
- **Frontend Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom components from shadcn/ui
- **Language**: TypeScript
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics

### Project Structure
```
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── signup/
│   ├── dashboard/                # Dashboard pages
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── users/
│   │   │   ├── organizations/
│   │   │   ├── approvals/
│   │   │   └── reports/
│   │   ├── organizer/            # Organizer dashboard
│   │   │   ├── events/
│   │   │   ├── tickets/
│   │   │   ├── attendees/
│   │   │   ├── finances/
│   │   │   ├── analytics/
│   │   │   └── order/
│   │   └── settings/
│   ├── events/                   # Public event pages
│   └── templates/
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   │   └── sidebar.tsx           # Dashboard navigation sidebar
│   └── ui/                       # shadcn/ui components
├── contexts/                     # React contexts (AuthContext)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── mock-data/                # Centralized mock data provider
│   │   ├── analytics.ts          # Analytics & chart data
│   │   ├── events.ts             # Event listings with full details
│   │   ├── orders.ts             # Order & transaction data
│   │   ├── organizations.ts      # Organization profiles
│   │   ├── tickets.ts            # Ticket types & pricing
│   │   ├── users.ts              # User profiles & roles
│   │   └── index.ts              # Central export file
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
└── types/                        # TypeScript types
```

### Key Features

#### User Roles
1. **Admin**: Platform management, user approval, organization verification, analytics
2. **Organizer**: Event creation, ticket management, attendee tracking, financial reports
3. **Attendee**: Event browsing, ticket purchasing, event attendance

#### Core Functionality
- **Event Management**: Create, edit, publish events with rich details
- **Ticketing System**: Multiple ticket types, pricing tiers, promotional codes
- **Order Processing**: Complete order management with refund capabilities
- **Payment Integration**: Support for Ethiopian payment methods (Chapa, Telebirr, CBE Birr)
- **Analytics Dashboard**: Event performance metrics, attendance tracking, revenue reports
- **User Management**: Role-based access control, organization verification
- **AI Recommendations**: Smart event suggestions based on user preferences

### Database Schema
The application expects a comprehensive database with the following main entities:
- Users (with roles: admin, organizer, attendee)
- Organizers (extended user profile with verification)
- Events (with status, financials, metadata)
- Ticket Types (with pricing, availability)
- Orders & Order Items (with payment tracking)
- Promotions, Feedback, Notifications
- Payment Transactions

See `schema.md` for detailed database schema and API endpoint specifications.

## Development Environment

### Running the Application
The app runs on port 5000 in development mode:
```bash
npm run dev
```

### Environment Configuration
- **Host**: 0.0.0.0 (required for Replit)
- **Port**: 5000 (frontend)
- **Cache Control**: Disabled for development (no-cache headers)

## Recent Changes
- **Nov 21, 2024**: Initial Replit setup
  - Configured Next.js with cache control headers to prevent stale content
  - Set up workflow "Start application" running on port 5000
  - Updated package.json to run dev server on 0.0.0.0:5000 (required for Replit)
  - Updated .gitignore for Node.js/Next.js project
  - Installed dependencies using --legacy-peer-deps (to resolve React 19 compatibility)
  - Configured deployment for autoscale with build and start commands
  - Application is running successfully with homepage displaying correctly

- **Nov 21, 2024**: Mock data system and UI improvements
  - Created centralized mock data provider system in `lib/mock-data/`
    - Organized by use cases: events, users, organizations, tickets, orders, analytics
    - TypeScript interfaces and helper functions for type-safe data access
    - Single source of truth for all mock data across the application
  - Fixed dashboard sidebar navigation
    - Removed duplicate "EventEase" text, kept styled logo with icon
    - Implemented exact match logic for active menu states (only one item active at a time)
    - Improved collapsed state with proper icon display
  - Updated pages to use centralized mock data:
    - Public events page: Enhanced UI with ratings, featured badges, improved layout
    - Admin organizations page: Using centralized organization data
    - Organizer events page: Added revenue display, status badges, better event cards

- **Nov 21, 2024**: Advanced UI/UX enhancements
  - Redesigned landing page hero section with next-level modern design
    - Animated gradient mesh backgrounds with pulsing orbs
    - Floating particle effects throughout the section
    - 3D-styled event image circles with hover effects (scale, rotate, overlay gradients)
    - Advanced gradient typography with animated text effects
    - Glass morphism search bar with glow effects on hover
    - Shimmer badge with ping animation indicator
    - Interactive stats section showing user count and 5-star ratings
    - Professional micro-interactions and smooth transitions
    - Purple/pink/indigo color scheme for modern aesthetic
  - Enhanced dashboard card styling for better visual hierarchy
    - All cards now use visible gray borders (border-2 border-gray-200 in light mode)
    - Dark mode support with border-gray-700 for proper contrast
    - Enhanced shadows (shadow-md with hover:shadow-lg) for depth
    - Hover states with primary color borders for interactivity
    - Consistent styling across stats cards, revenue overview, ticket sales, and approval status
  - Extended Tailwind config with custom animations
    - Float animations: float-slow, float-medium, float-fast, float-slower
    - Pulse animations: pulse-slow, pulse-slower, pulse-medium
    - Gradient effects: gradient-x for animated backgrounds
    - Shimmer effect: shimmer-slow for subtle shine effects
    - All animations optimized for smooth 60fps performance

## User Preferences
- None recorded yet

## Next Steps
The application currently uses mock data throughout. To make it fully functional, you'll need to:
1. Set up a PostgreSQL database (Replit provides built-in Postgres)
2. Implement API routes for authentication and data operations
3. Integrate payment provider APIs (Chapa, Telebirr)
4. Set up file upload for event images and organizer documents
5. Implement email notifications
6. Configure production deployment settings

## Notes
- The application is configured to ignore TypeScript and ESLint errors during build
- Images are set to unoptimized mode for compatibility
- Mock data system provides realistic demo data organized in `lib/mock-data/`
  - All pages import from centralized mock data provider
  - Helper functions available: `getEventById()`, `getEventsByOrganizer()`, etc.
  - When implementing real database, replace imports from `lib/mock-data` with API calls
- Sidebar navigation uses exact path matching to ensure only one menu item is active at a time
