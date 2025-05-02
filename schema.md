# EventEase Database Schema

This document outlines the database schema for the EventEase application based on the frontend requirements. It provides the structure for all database models, their relationships, and detailed field information to ensure proper functionality of the platform.

## Core Models

### 1. User

The base model for all users of the system.

```
User {
  id: String (UUID, Primary Key)
  name: String (Full name of the user)
  email: String (Unique, Required)
  password: String (Hashed, Required)
  phone: String (Optional)
  avatar: String (URL to profile image, Optional)
  role: Enum ["admin", "organizer", "attendee"] (Default: "attendee")
  status: Enum ["active", "inactive", "pending"] (Default: "pending")
  joinDate: Date (Automatically set on creation)
  lastLogin: Date (Updated on each login)
  emailVerified: Boolean (Default: false)
  resetPasswordToken: String (Optional)
  resetPasswordExpires: Date (Optional)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 2. Organizer (extends User)

Additional information specific to event organizers.

```
Organizer {
  userId: String (Foreign Key to User, Primary Key)
  companyName: String (Required)
  description: String (Optional)
  logo: String (URL to logo image, Optional)
  website: String (Optional)
  socialMedia: Object {
    facebook: String (Optional)
    twitter: String (Optional)
    instagram: String (Optional)
    linkedin: String (Optional)
  }
  address: String (Optional)
  region: String (Optional)
  verified: Boolean (Default: false)
  verificationDocuments: Array of Strings (URLs to document uploads)
  followers: Number (Default: 0)
  totalEvents: Number (Default: 0)
  status: Enum ["approved", "pending", "rejected"] (Default: "pending")
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 3. Event

Represents an event created by an organizer.

```
Event {
  id: String (UUID, Primary Key)
  title: String (Required)
  description: String (Required)
  longDescription: String (Optional, HTML content)
  date: Date (Required)
  time: String (Required, Format: "HH:MM AM/PM - HH:MM AM/PM")
  location: String (Required)
  address: String (Required)
  region: String (Required)
  price: String (Optional, used for display)
  category: String (Required)
  status: Enum ["Draft", "Pending", "Published", "Cancelled"] (Default: "Draft")
  image: String (URL to main event image)
  gallery: Array of Strings (URLs to additional images)
  organizerId: String (Foreign Key to Organizer)
  attendees: Number (Default: 0)
  maxAttendees: Number (Optional)
  revenue: Number (Default: 0)
  expenses: Number (Default: 0)
  profit: Number (Default: 0)
  featured: Boolean (Default: false)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 4. TicketType

Defines different ticket types available for an event.

```
TicketType {
  id: String (UUID, Primary Key)
  eventId: String (Foreign Key to Event)
  name: String (Required)
  description: String (Optional)
  price: Number (Required)
  currency: String (Default: "ETB")
  quantity: Number (Required, total tickets available)
  sold: Number (Default: 0)
  available: Number (Computed: quantity - sold)
  startDate: Date (Optional, sales start date)
  endDate: Date (Optional, sales end date)
  minPerOrder: Number (Default: 1)
  maxPerOrder: Number (Optional)
  benefits: Array of Strings (Optional)
  requirements: String (Optional)
  transferable: Boolean (Default: true)
  refundable: Boolean (Default: true)
  revenue: Number (Default: 0, computed)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 5. Promotion

Promotional discount codes for events.

```
Promotion {
  id: String (UUID, Primary Key)
  eventId: String (Foreign Key to Event)
  code: String (Required, Unique per event)
  discountType: Enum ["percentage", "fixed"] (Required)
  discountValue: Number (Required)
  maxUses: Number (Optional)
  used: Number (Default: 0)
  available: Number (Computed: maxUses - used)
  startDate: Date (Optional)
  endDate: Date (Optional)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 6. EventSchedule

Schedule items for an event.

```
EventSchedule {
  id: String (UUID, Primary Key)
  eventId: String (Foreign Key to Event)
  time: String (Required, Format: "HH:MM AM/PM - HH:MM AM/PM")
  title: String (Required)
  description: String (Optional)
  location: String (Required)
  speaker: String (Optional)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 7. Order

Represents a ticket purchase order.

```
Order {
  id: String (UUID, Primary Key)
  userId: String (Foreign Key to User)
  eventId: String (Foreign Key to Event)
  totalAmount: Number (Required)
  currency: String (Default: "ETB")
  status: Enum ["pending", "completed", "cancelled", "refunded"] (Default: "pending")
  paymentMethod: String (Required)
  transactionId: String (Optional)
  promotionId: String (Foreign Key to Promotion, Optional)
  discountAmount: Number (Default: 0)
  purchaseDate: Date (Automatically set)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 8. OrderItem

Individual ticket items within an order.

```
OrderItem {
  id: String (UUID, Primary Key)
  orderId: String (Foreign Key to Order)
  ticketTypeId: String (Foreign Key to TicketType)
  quantity: Number (Required)
  unitPrice: Number (Required)
  totalPrice: Number (Required)
  attendeeName: String (Optional)
  attendeeEmail: String (Optional)
  checkInStatus: Enum ["not_checked", "checked_in"] (Default: "not_checked")
  checkInTime: Date (Optional)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 9. EventFAQ

Frequently asked questions about an event.

```
EventFAQ {
  id: String (UUID, Primary Key)
  eventId: String (Foreign Key to Event)
  question: String (Required)
  answer: String (Required)
  order: Number (Optional, for display order)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

### 10. Feedback

Attendee feedback for events.

```
Feedback {
  id: String (UUID, Primary Key)
  eventId: String (Foreign Key to Event)
  userId: String (Foreign Key to User)
  rating: Number (Required, 1-5)
  comment: String (Optional)
  createdAt: Date (Automatically set)
  updatedAt: Date (Automatically updated)
}
```

## Relationship Diagrams

### User Relationships
- User 1:1 Organizer (if role is "organizer")
- User 1:N Orders (as an attendee)
- User 1:N Feedback (provided for events)

### Organizer Relationships
- Organizer 1:1 User (extension of user)
- Organizer 1:N Events (created by organizer)

### Event Relationships
- Event N:1 Organizer (created by)
- Event 1:N TicketTypes (available for purchase)
- Event 1:N Promotions (discount codes)
- Event 1:N EventSchedule (agenda items)
- Event 1:N EventFAQ (questions and answers)
- Event 1:N Orders (purchases for this event)
- Event 1:N Feedback (provided by attendees)

### Order Relationships
- Order N:1 User (purchased by)
- Order N:1 Event (for this event)
- Order 1:N OrderItems (tickets purchased)
- Order N:0/1 Promotion (discount applied)

## API Endpoints

Based on the frontend implementation, the following API endpoints will be needed:

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/reset-password
- POST /api/auth/verify-email

### Users
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users (admin only)
- GET /api/users/:id (admin only)
- PUT /api/users/:id (admin only)
- DELETE /api/users/:id (admin only)

### Organizers
- POST /api/organizers (apply to become organizer)
- GET /api/organizers
- GET /api/organizers/:id
- PUT /api/organizers/:id (own profile only or admin)
- GET /api/organizers/:id/events
- PUT /api/organizers/:id/approval (admin only)

### Events
- GET /api/events (with filters, pagination)
- POST /api/events (create new event, organizer only)
- GET /api/events/:id
- PUT /api/events/:id (organizer/owner only)
- DELETE /api/events/:id (organizer/owner only)
- GET /api/events/:id/tickets
- GET /api/events/:id/schedule
- GET /api/events/:id/faqs
- GET /api/events/:id/promotions (organizer only)
- GET /api/events/:id/attendees (organizer only)
- GET /api/events/:id/analytics (organizer only)
- PUT /api/events/:id/status (organizer only)
- PUT /api/events/:id/approval (admin only)

### Tickets
- GET /api/tickets
- POST /api/events/:id/tickets (organizer only)
- PUT /api/tickets/:id (organizer only)
- DELETE /api/tickets/:id (organizer only)

### Promotions
- GET /api/promotions
- POST /api/events/:id/promotions (organizer only)
- PUT /api/promotions/:id (organizer only)
- DELETE /api/promotions/:id (organizer only)
- GET /api/promotions/validate/:code (validate a promo code)

### Orders
- GET /api/orders (user's orders or organizer's event orders)
- POST /api/orders (create new order)
- GET /api/orders/:id
- PUT /api/orders/:id/status
- POST /api/orders/checkout (initiate payment)
- POST /api/orders/webhook (payment provider callback)

### Attendees
- GET /api/events/:id/attendees (organizer only)
- PUT /api/attendees/:id/check-in (organizer only)
- GET /api/users/:id/events (events user is attending)

### Analytics
- GET /api/organizers/:id/dashboard (organizer dashboard stats)
- GET /api/events/:id/analytics (detailed event analytics)
- GET /api/admin/dashboard (admin dashboard stats)

## Important Considerations

1. **Authentication & Authorization**:
   - JWT-based authentication
   - Role-based access control (admin, organizer, attendee)
   - Different permissions based on user role

2. **Payment Integration**:
   - Integration with Chapa Payment gateway
   - Support for multiple payment methods
   - Secure transaction handling
   - Webhook support for payment callbacks

3. **Image Storage**:
   - Storage solution for event images, gallery, user avatars, etc.
   - Could be implemented with cloud storage (S3, Google Cloud Storage)

4. **Data Validation**:
   - Input validation for all API endpoints
   - Data sanitization to prevent XSS
   - Schema validation for request payloads

5. **Performance Considerations**:
   - Index fields commonly used in queries (eventId, userId, etc.)
   - Consider caching for frequently accessed data
   - Pagination for large data sets (events, attendees, etc.)

6. **Security Considerations**:
   - Protect sensitive user data
   - Implement rate limiting
   - Use HTTPS for all endpoints
   - Validate and sanitize all inputs

This schema outlines the key structures needed to support the EventEase platform based on the frontend implementation. Adjustments may be needed as development progresses. 