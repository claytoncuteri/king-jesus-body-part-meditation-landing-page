# Design Guidelines: King Jesus Body Part Meditation Landing Page

## Design Approach

**Reference-Based Approach:** Drawing inspiration from premium spiritual wellness platforms (Calm, Headspace) combined with conversion-focused e-commerce patterns (Goop, spiritual product marketplaces). The design should evoke divine serenity while maintaining trust and credibility for the financial transformation story.

## Core Design Elements

### A. Color Palette

**Primary Colors (Dark Mode):**
- Divine Gold: 45 85% 65% - Primary brand color, headers, CTAs, star accents
- Sacred White: 0 0% 98% - Text, card backgrounds
- Celestial Blue: 220 75% 55% - Secondary accent, links, trust elements
- Royal Red: 355 75% 55% - Urgency/value highlights, limited use

**Supporting Colors:**
- Deep Navy: 230 35% 12% - Page background
- Soft Gold Glow: 45 85% 75% - Hover states, subtle highlights
- Translucent White: 0 0% 100% at 10% opacity - Card overlays, glassmorphism

### B. Typography

**Font Families:**
- Headlines: 'Playfair Display' (serif) - Regal, spiritual authority
- Body: 'Inter' (sans-serif) - Clean readability
- Accent/Numbers: 'Cinzel' (serif) - Decorative for value displays

**Hierarchy:**
- Hero H1: text-6xl font-bold (Playfair Display)
- Section H2: text-4xl font-semibold (Playfair Display)
- Body: text-lg leading-relaxed (Inter)
- Price/Value: text-3xl font-bold (Cinzel)

### C. Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20, 24 (e.g., p-8, mb-12, py-20)

**Grid Structure:**
- Container: max-w-7xl mx-auto px-4
- Multi-column sections: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Single column content: max-w-4xl mx-auto for readability

### D. Component Library

**Navigation:**
- Sticky header with glassmorphism (backdrop-blur-xl bg-navy/80)
- Logo left, CTA button right (gold gradient)
- Mobile: hamburger menu, full-screen overlay

**Hero Section:**
- Full-width split layout: 60% content (left), 40% imagery (right) on desktop
- Stack vertically on mobile
- Large headline with gold gradient text effect
- Two prominent images: Mahavatar Babaji (top) and King Jesus Throne (below), both with 5-pointed star overlays in corners
- Primary CTA: Large gold gradient button with subtle glow effect
- Background: Deep navy with subtle radial gradient emanating from center

**Cards:**
- Elevated cards with subtle gold border (border border-gold/20)
- Glassmorphism effect: bg-white/5 backdrop-blur-sm
- Hover: lift effect (hover:translate-y-[-4px]) with increased glow
- Padding: p-8 for spacious feel

**Value Breakdown Section:**
- Grid of product cards: 2 columns on tablet, 3 on desktop
- Each card shows product name, individual price (strikethrough), included badge
- Bottom summary card: Total value vs. actual price with dramatic contrast
- Gold star icons scattered as decorative elements

**Personal Story Section:**
- Large testimonial-style card with Clayton's photo (circular, gold border)
- Quote-style layout with quotation marks in gold
- Statistics highlighted: "-$10,000" to "$1.1M" in large, contrasting colors
- Timeline visual showing journey (Jan 2024 to Oct 2025)

**Testimonials:**
- Masonry grid layout (Pinterest-style) for dynamic feel
- Each testimonial: user initial avatar (gold circle), quote, hashtag
- Instagram-style presentation with subtle blue accent for username
- Real-time counter showing #KingJesusMeditation post count

**Forms:**
- Floating label inputs with gold focus state
- Dark input backgrounds (bg-white/10) with white text
- Generous padding (p-4) for touch-friendly mobile experience
- Submit buttons: full-width gold gradient on mobile, auto-width on desktop

**Instructions Section:**
- Numbered steps with large gold numerals in circular badges
- Each step in its own card with icon, title, description
- 3-column grid on desktop, stacked on mobile
- Icons: custom spiritual symbols (meditation pose, headphones, journal)

**Mission Statement:**
- Full-width section with background overlay of subtle church imagery
- Centered text with max-w-3xl
- Large, inspiring typography
- "100% proceeds" highlighted in gold with underline decoration

**Social Sharing:**
- Instagram feed-style preview section
- Sample post cards showing #KingJesusMeditation examples
- Large "Share Your Journey" CTA with Instagram icon
- Follower count display: "@claytoncuteri • 110K followers" in blue accent
- Live Instagram follower counter (if API available)

**Admin Dashboard:**
- Clean, data-focused design (minimal spiritual elements)
- Card-based KPI layout: Visitors, Conversions, Revenue, Click-through rates
- Line charts for trends (use Chart.js with gold/blue color scheme)
- Testimonial management: table with add/edit/delete actions
- Authentication: simple login form with same design system

**Footer:**
- 3-column layout: Legal links (left), Social (center), Disclaimer (right)
- Dark background (bg-navy-darker) with gold divider line above
- Privacy Policy and Terms links prominently displayed
- Social icons in gold on hover
- Fine print disclaimer in smaller, muted text

**Legal Pages (Privacy & Terms):**
- Clean document layout with max-w-4xl mx-auto
- Hierarchical headings with gold accent
- Readable body text with proper spacing (leading-loose)
- Back to home link at top and bottom
- Sticky navigation for long documents

### E. Visual Elements

**5-Pointed Stars:**
- SVG stars in gold scattered as decorative elements
- Corner accents on hero images (4 stars per image)
- Random distribution in background (low opacity: 0.1)
- Use transform: rotate() for varied angles

**Buttons:**
- Primary CTA: Gradient from gold to lighter gold, white text, rounded-lg, px-8 py-4
- Secondary: Outline style (border-2 border-gold text-gold), backdrop-blur-md bg-white/10 when on images
- Hover: Subtle scale effect (hover:scale-105) and increased glow
- No custom hover states for outline buttons on images - rely on default button behavior

**Glassmorphism Effects:**
- Cards on images: backdrop-blur-xl bg-white/10 border border-white/20
- Navigation: backdrop-blur-lg bg-navy/90
- Modal overlays: backdrop-blur-sm bg-black/50

**Animations:**
- Minimal, purposeful only
- Fade-in on scroll for sections (opacity + translateY)
- Subtle glow pulse on primary CTA (2s interval)
- Star twinkle effect (random opacity changes, very subtle)
- No distracting scroll animations

## Images

**Required Images:**
1. **Mahavatar Babaji Photo** (attached_assets/mahavatarbabaji_1759948082174.jpg)
   - Placement: Top of hero section, above King Jesus image
   - Treatment: Rounded corners, gold border (border-4 border-gold), shadow-2xl
   - Size: w-full max-w-md on desktop, smaller on mobile
   - Stars: 5-pointed gold stars in each corner

2. **King Jesus Throne Image** (attached_assets/kingjesusthrone_1759948082173.JPG)
   - Placement: Below Babaji image in hero section
   - Treatment: Same as Babaji - rounded corners, gold border, shadow-2xl
   - Size: w-full max-w-md on desktop
   - Stars: 5-pointed gold stars in each corner

3. **Clayton Cuteri Photo** (placeholder needed)
   - Placement: Personal story section
   - Treatment: Circular crop, thick gold border (border-8), centered
   - Size: w-48 h-48 or w-64 h-64

4. **Background Textures:**
   - Subtle church/spiritual imagery as watermark (opacity: 0.05) in mission section
   - Starfield pattern for page background (very subtle)

## Responsive Behavior

**Mobile-First Priorities:**
- Instagram traffic optimized: Fast load, immediate CTA visibility
- Touch targets: minimum 48px height for all interactive elements
- Stack all multi-column layouts to single column below md breakpoint
- Hero images: Full-width, vertically stacked
- Forms: Full-width inputs with large tap areas
- Sticky CTA button at bottom of viewport on mobile for easy conversion

**Breakpoints:**
- Mobile: Base styles (single column)
- Tablet: md: (768px) - 2 columns where appropriate
- Desktop: lg: (1024px) - 3 columns, expanded layouts
- Wide: xl: (1280px) - max container width, optimal viewing

## Conversion Optimization

- Hero CTA: Above fold, high contrast gold button, clear value prop
- Trust indicators: Testimonial count, follower count, money-back mention
- Urgency: "Limited time" or value comparison prominently displayed
- Progressive disclosure: Key info first, details as user scrolls
- Social proof: Testimonials early, Instagram integration throughout
- Clear pricing: $60.27 value crossed out, $4.95 bold and large
- Frictionless checkout: Single-click to Stripe, minimal form fields