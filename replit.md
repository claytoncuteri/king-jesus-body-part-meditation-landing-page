# King Jesus Meditation Landing Page

## Overview

This is a digital product landing page for "King Jesus Body Part Meditation" by Clayton Cuteri. The application is a full-stack TypeScript/React landing page with payment processing, email automation, and analytics tracking. Users can purchase a meditation package for $4.95 that includes video content, podcast episodes, PDFs, and templates delivered via automated email.

The primary goal is to convert visitors into customers through spiritual messaging, social proof, and a low-friction checkout experience. The application emphasizes divine transformation, prosperity messaging, and a mission-driven approach (100% of proceeds support building the Church of King Jesus).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Download Page & Email Setup (Latest)
- Added secure download page system with unique token-based access per purchase
- Each purchase generates a unique downloadToken (UUID) for secure access
- POST /api/checkout/confirm-payment endpoint confirms payment and updates purchase status to "completed"
- Success page calls confirmation endpoint and displays download link immediately
- Download page shows all visible package items with secure access (requires status="completed")
- Admin panel includes "Email Setup" tab with ConvertKit integration instructions
- ConvertKit automation emails can include download link format: /download/{{DOWNLOAD_TOKEN}}
- Webhook-less payment confirmation for test mode (production uses Stripe webhooks)

### Testimonials Enhancement
- Added gender and age fields to testimonials schema
- Admin dashboard now supports full CRUD operations with all testimonial fields
- Landing page displays gender and age (e.g., "Female, 32") instead of "Verified Student"
- Age field properly validated as integer with frontend conversion from string input
- Frontend converts empty age values to undefined before API submission

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS with shadcn/ui component library
- **State Management:** TanStack Query (React Query) for server state
- **Forms:** React Hook Form with Zod validation

**Design System:**
- Dark mode spiritual theme with gold/navy/blue color palette
- Custom fonts: Playfair Display (serif headers), Inter (body text), Cinzel (decorative numbers)
- Glassmorphism effects and five-pointed star iconography
- Responsive mobile-first design

**Key Pages:**
- Landing page with hero, value proposition, testimonials, FAQ
- Stripe checkout page with payment element integration
- Success page with product delivery confirmation
- Admin dashboard for testimonial/analytics management (Replit Auth protected)
- Privacy and Terms pages

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express
- **Language:** TypeScript with ES modules
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (via Neon serverless driver)
- **Session Management:** express-session with PostgreSQL storage
- **Authentication:** Replit Auth with Passport.js OpenID Connect strategy

**API Design:**
- RESTful endpoints under `/api` namespace
- Authentication middleware for protected routes (admin functions)
- Error handling middleware with structured JSON responses
- Request/response logging for debugging

**Key Routes:**
- `/api/checkout/create-payment-intent` - Stripe payment intent creation with automatic tax
- `/api/checkout/confirm-payment` - Payment confirmation and product delivery trigger
- `/api/leads` - Email lead capture (ConvertKit integration)
- `/api/testimonials` - CRUD operations for testimonials
- `/api/analytics` - Event tracking and summary statistics
- `/api/auth/*` - Replit Auth login/logout/user endpoints

### Data Storage

**Database Schema (PostgreSQL via Drizzle):**
- `sessions` - Express session storage for Replit Auth
- `users` - User profiles from Replit Auth (email, name, admin flag)
- `testimonials` - Customer testimonials with name, content, gender (varchar), age (integer), visibility toggle
- `purchases` - Purchase records with Stripe payment intent tracking
- `email_leads` - Email capture tracking with source attribution
- `analytics_events` - Event tracking (page views, button clicks, purchases)

**Storage Interface Pattern:**
- Abstract `IStorage` interface defines all database operations
- Concrete implementation uses Drizzle ORM with typed queries
- Supports user management, testimonials, purchases, leads, and analytics

### External Dependencies

**Payment Processing:**
- **Stripe:** Complete payment flow with automatic tax calculation
- Stripe Checkout uses Payment Element for card collection
- Webhook-less confirmation via client-side intent verification
- Price: $4.95 USD with dynamic tax based on buyer location

**Email Marketing & Automation:**
- **ConvertKit API:** Lead capture and automated product delivery
- Required environment variables: `CONVERTKIT_API_KEY`, `CONVERTKIT_API_SECRET`, `CONVERTKIT_FORM_ID`, `CONVERTKIT_PURCHASE_TAG_ID`
- Lead capture via form subscription endpoint
- Purchase tagging triggers automated email with digital product links
- Supports first name personalization

**Authentication:**
- **Replit Auth:** OAuth-based authentication for admin access
- Uses OpenID Connect with Passport.js strategy
- Admin dashboard protected by `isAdmin` flag in user records
- Session-based authentication with PostgreSQL session store

**Development Tools:**
- Vite for frontend build and HMR
- Replit-specific plugins for error overlay and dev banner
- esbuild for server-side bundling in production

**Environment Configuration:**
Required secrets:
- `DATABASE_URL` - PostgreSQL connection string
- `TESTING_STRIPE_SECRET_KEY` - Stripe test API secret (DEVELOPMENT - currently in use)
- `TESTING_VITE_STRIPE_PUBLIC_KEY` - Stripe test publishable key (DEVELOPMENT - currently in use)
- `STRIPE_SECRET_KEY` - Stripe LIVE API secret (PRODUCTION ONLY - switch before deploying!)
- `VITE_STRIPE_PUBLIC_KEY` - Stripe LIVE publishable key (PRODUCTION ONLY - switch before deploying!)
- `CONVERTKIT_API_KEY` - ConvertKit API key
- `CONVERTKIT_API_SECRET` - ConvertKit API secret  
- `CONVERTKIT_FORM_ID` - ConvertKit form for lead capture
- `CONVERTKIT_PURCHASE_TAG_ID` - ConvertKit tag for purchase automation
- `SESSION_SECRET` - Express session encryption key
- `REPL_ID` - Replit deployment identifier
- `ISSUER_URL` - OAuth issuer (defaults to Replit OIDC)

**🚨 DEPLOYMENT CHECKLIST:**
1. **BEFORE DEPLOYING TO PRODUCTION:** Update `server/routes.ts` and `client/src/pages/checkout.tsx` to use LIVE Stripe keys (`STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`) instead of TESTING keys
2. Currently using TESTING keys for safe development with test cards like 4242424242424242
3. Live keys will process real charges on real credit cards - use with caution!