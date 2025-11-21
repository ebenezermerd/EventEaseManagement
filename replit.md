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
│   ├── dashboard/
│   └── ui/                       # shadcn/ui components
├── contexts/                     # React contexts (AuthContext)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
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
- All placeholder data should be replaced with real database queries
