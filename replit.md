# King Jesus Meditation Landing Page

## Overview

This is a digital product landing page for "King Jesus Body Part Meditation" by Clayton Cuteri. The application is a full-stack TypeScript/React landing page with payment processing, email automation, and analytics tracking. Users can purchase a meditation package for $4.95 that includes video content, podcast episodes, PDFs, and templates delivered via automated email.

The primary goal is to convert visitors into customers through spiritual messaging, social proof, and a low-friction checkout experience. The application emphasizes divine transformation, prosperity messaging, and a mission-driven approach (100% of proceeds support building the Church of King Jesus).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Production Build & Deployment Preparation (Latest - Oct 13, 2025)
- Built production assets successfully (index-DJ-YEkW9.css, index-Du2YvnN9.js)
- Fixed Content Security Policy headers to allow Stripe integration and inline styles
- Added cache control headers for development mode
- Resolved white screen issue: Replit proxy was serving cached production HTML while dev server ran development mode
- App ready for deployment: All production files generated and tested
- Status: **READY TO DEPLOY** - Switch to production Stripe keys before publishing

### Package Items Setup
- Added 5 package items to database with placeholder content URLs
- Items can be updated with real URLs later via admin panel or direct database update
- Package includes: meditation video, podcast episodes, 2 PDFs, meditation journal template
- Admin file upload available but can be bypassed by updating contentUrl field directly

### Admin Password Authentication
- Replaced Replit Auth with simple password-based authentication
- Admin login now requires ADMIN_PASSWORD environment variable (no default fallback)
- Secure session management with PostgreSQL session store
- Login/logout activity logged with timestamps for security monitoring
- Session cookies: HTTP-only, secure in production, 7-day expiration

### Download Page & Email Setup
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
- Admin dashboard for testimonial/analytics management (password protected)
- Download page with secure token-based access to purchased content
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
- **Simple Password Auth:** Password-based authentication for admin access
- Admin dashboard protected by ADMIN_PASSWORD environment variable
- Session-based authentication with PostgreSQL session store
- Secure cookies in production, login/logout tracking with timestamps

**Development Tools:**
- Vite for frontend build and HMR
- Replit-specific plugins for error overlay and dev banner
- esbuild for server-side bundling in production

**Environment Configuration:**
Required secrets:
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_PASSWORD` - Admin dashboard password (required - no default)
- `TESTING_STRIPE_SECRET_KEY` - Stripe test API secret (DEVELOPMENT - currently in use)
- `TESTING_VITE_STRIPE_PUBLIC_KEY` - Stripe test publishable key (DEVELOPMENT - currently in use)
- `STRIPE_SECRET_KEY` - Stripe LIVE API secret (PRODUCTION ONLY - switch before deploying!)
- `VITE_STRIPE_PUBLIC_KEY` - Stripe LIVE publishable key (PRODUCTION ONLY - switch before deploying!)
- `CONVERTKIT_API_KEY` - ConvertKit API key
- `CONVERTKIT_API_SECRET` - ConvertKit API secret  
- `CONVERTKIT_FORM_ID` - ConvertKit form for lead capture
- `CONVERTKIT_PURCHASE_TAG_ID` - ConvertKit tag for purchase automation
- `SESSION_SECRET` - Express session encryption key

**🚨 DEPLOYMENT CHECKLIST:**
1. **BEFORE DEPLOYING TO PRODUCTION:** Update `server/routes.ts` and `client/src/pages/checkout.tsx` to use LIVE Stripe keys (`STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`) instead of TESTING keys
2. Currently using TESTING keys for safe development with test cards like 4242424242424242
3. Live keys will process real charges on real credit cards - use with caution!