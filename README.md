# King Jesus Body Part Meditation - Landing Page

A high-conversion landing page for selling the "King Jesus Body Part Meditation" digital product by Clayton Cuteri. Built with React, TypeScript, and Express with Stripe payment processing and ConvertKit email automation.

## 🎯 Project Overview

This full-stack application serves as a complete sales funnel for a $4.95 digital meditation package with optional $9 Church of King Jesus donation upsell. The application handles payment processing, automated email delivery, and secure digital product access.

**Live Site:** [jesusbodymeditation.travelingtoconsciousness.com](https://jesusbodymeditation.travelingtoconsciousness.com)

## ✨ Features

### Frontend
- **Landing Page** - Conversion-optimized design with social proof, testimonials, and FAQ
- **Stripe Checkout** - Secure payment processing with automatic tax calculation
- **Upsell Flow** - Optional $9 donation to Church of King Jesus after initial purchase
- **Download Page** - Secure token-based access to purchased digital content
- **Admin Dashboard** - Manage testimonials, package items, and view analytics (password protected)

### Backend
- **Payment Processing** - Stripe integration with webhook support for payment confirmation
- **Email Automation** - ConvertKit integration for lead capture and product delivery
- **Database** - PostgreSQL with Drizzle ORM for data persistence
- **Session Management** - Secure session handling with PostgreSQL storage
- **Analytics** - Track page views, button clicks, and purchase events

### Security
- Simple password-based admin authentication
- Content Security Policy headers for XSS protection
- Secure session cookies (HTTP-only, secure in production)
- Environment-based secret management

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Wouter (client-side routing)
- Tailwind CSS + shadcn/ui components
- TanStack Query (data fetching)
- Stripe.js (payment UI)

**Backend:**
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM
- PostgreSQL (Neon serverless driver)
- Stripe API (payments)
- ConvertKit API (email marketing)

**Design:**
- Dark spiritual theme with gold/navy/blue palette
- Custom fonts: Playfair Display, Inter, Cinzel
- Glassmorphism effects
- Five-pointed star iconography
- Responsive mobile-first design

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Stripe account
- ConvertKit account (optional for email)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd king-jesus-meditation

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Visit `http://localhost:5000` to see the app.

## 🔐 Environment Variables

Create a `.env` file with the following variables:

### Required for Production
```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# Stripe (LIVE keys for production)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password

# Session Security
SESSION_SECRET=your_random_session_secret
```

### Optional (Email Automation)
```bash
# ConvertKit
CONVERTKIT_API_KEY=your_convertkit_api_key
CONVERTKIT_API_SECRET=your_convertkit_api_secret
CONVERTKIT_FORM_ID=your_form_id
CONVERTKIT_PURCHASE_TAG_ID=your_purchase_tag_id
```

### Development/Testing
```bash
# Stripe Test Keys (for development only)
TESTING_STRIPE_SECRET_KEY=sk_test_...
TESTING_VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:push --force # Force push schema (if warnings appear)

# Type Checking
npm run check           # Run TypeScript type checking
```

## 🗄️ Database Schema

### Tables
- **users** - Admin user accounts
- **testimonials** - Customer testimonials with gender/age
- **purchases** - Purchase records linked to Stripe payment intents
- **package_items** - Digital product content items
- **email_leads** - Email capture tracking
- **analytics_events** - User interaction tracking
- **sessions** - Express session storage

## 💳 Payment Flow

1. User enters email/name on landing page
2. Clicks "Get Access Now" → redirected to Stripe checkout
3. Completes payment with card details
4. Optional upsell appears for $9 donation
5. Payment confirmed via client-side or webhook
6. User receives download page link with unique token
7. ConvertKit sends automated email with product access

## 📧 Email Integration (ConvertKit)

The app integrates with ConvertKit for:
- **Lead capture** - Form subscription when user enters email
- **Product delivery** - Automated email with download link after purchase
- **Purchase tagging** - Tags customers for segmentation

### Setup ConvertKit Automation
1. Create a form in ConvertKit (get `CONVERTKIT_FORM_ID`)
2. Create a tag for purchasers (get `CONVERTKIT_PURCHASE_TAG_ID`)
3. Create automation sequence triggered by tag
4. Include download link in email: `https://yourdomain.com/download/{{DOWNLOAD_TOKEN}}`

## 🔒 Admin Dashboard

Access the admin dashboard at `/admin` with your `ADMIN_PASSWORD`.

Features:
- View analytics summary (views, leads, purchases, revenue)
- Manage testimonials (CRUD operations)
- Manage package items (digital product content)
- View recent activity logs

## 🚢 Deployment

### Deploying to Replit

1. Click "Publish" button in Replit workspace
2. Select "Autoscale Deployment"
3. Configure settings:
   - Build command: `npm run build`
   - Run command: `npm start`
4. Ensure all environment variables are set
5. Click "Publish" to deploy

### Post-Deployment Setup

1. **Configure Stripe Webhook** (Required for production):
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select event: `payment_intent.succeeded`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET` environment variable

2. **Set up Custom Domain** (Optional):
   - Configure DNS CNAME record in your domain provider
   - Point to your Replit deployment URL

3. **Copy Production Database** (Recommended):
   - Check "Copy development database to production" when publishing
   - Ensures testimonials and package items are available

## 📱 Custom Domain Setup

The app is configured for custom domain: `jesusbodymeditation.travelingtoconsciousness.com`

### DNS Configuration (Namecheap)
1. Log into Namecheap domain dashboard
2. Go to Advanced DNS settings
3. Add CNAME record:
   - Host: `jesusbodymeditation`
   - Value: `your-replit-deployment.replit.app`
   - TTL: Automatic

## 🧪 Testing

### Test Cards (Stripe Test Mode)
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Admin Login
- URL: `/admin`
- Password: Set via `ADMIN_PASSWORD` environment variable

## 📄 License

Copyright © 2025 Clayton Cuteri. All rights reserved.

## 🙏 Attribution

Built by Clayton Cuteri for the Church of King Jesus ministry.

---

**Need help?** Contact support or open an issue on GitHub.
