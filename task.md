# Ceylon Curry — Implementation Checklist & Tasks

## Phase 1: Project Foundation & Architecture
- [ ] Initialize Next.js 14+ App Router project with TypeScript & Tailwind CSS
- [ ] Configure `tailwind.config.ts` with Ceylon Curry color palette (`#061B8F`, `#F4C430`, `#D92B20`, `#FFF8E8`, `#171717`)
- [ ] Set up environment variable template `.env.local.example`
- [ ] Implement database connection `src/lib/mongodb.ts`

## Phase 2: Database Schemas & Seed Data
- [ ] `Settings` Mongoose Model (Single source of truth for restaurant details)
- [ ] `Admin` Mongoose Model (Secure admin user schema)
- [ ] `Product` Mongoose Model (Max 4 Cloudinary images, offer fields, allergens)
- [ ] `Category` Mongoose Model
- [ ] `Table` Mongoose Model (7 tables: T1-T4 Couple 2-seat, T5-T7 Family 4-seat)
- [ ] `Reservation` Mongoose Model (Indexed by date + tableId)
- [ ] `Order` Mongoose Model (Operational tracker for WhatsApp checkouts)
- [ ] Seed script (`src/lib/seed.ts`) initializing Admin, Settings, 7 Tables, Categories & Dishes

## Phase 3: API Route Handlers
- [ ] `/api/settings` (GET public, PUT admin protected)
- [ ] `/api/products` & `/api/products/[id]` (GET, POST, PUT, DELETE + Cloudinary cleanup)
- [ ] `/api/categories` & `/api/categories/[id]` (GET, POST, PUT, DELETE)
- [ ] `/api/tables` & `/api/tables/[id]` (GET, PUT status & release)
- [ ] `/api/reservations` & `/api/reservations/[id]` (GET, POST with 1-hr protection & Nodemailer, PUT status)
- [ ] `/api/orders` (POST server-side price validation & WhatsApp message generation)
- [ ] `/api/upload` (POST image uploader enforcing max 4 images)
- [ ] `/api/admin/auth` (POST login/logout with secure HTTP-only cookies)

## Phase 4: State Management & Centralized Propagation
- [ ] `SettingsContext` for dynamic propagation of mobile/WhatsApp/email/address across application
- [ ] `CartContext` with LocalStorage persistence and discount calculations

## Phase 5: Public Website Pages & Components
- [ ] Sticky `Header` with logo, dynamic call CTA, cart badge & mobile drawer
- [ ] `Footer` with dynamic contact details, social links, opening hours
- [ ] Homepage (`/`): Hero, Story, Featured Menu, Today's Offers, Why Choose Us, Restaurant Experience, Reservation CTA, Location Card
- [ ] Menu Catalog (`/menu`): Search, category filter, price slider, offer filter, availability toggle, sorting
- [ ] Product Detail Page (`/menu/[id]`): 4-image gallery, ingredients, allergens, quantity control, add to cart
- [ ] Daily Offers Page (`/offers`): Active deal showcase with discount badges
- [ ] Cart Page (`/cart`): Quantity modifier, item removal, discount calculator
- [ ] Checkout Page (`/checkout`): Form validation, WhatsApp deep-link generation
- [ ] Interactive Reservation Page (`/reserve`): 7-Table visual floor plan, guest count validation, 1-hr protection window
- [ ] Reservation Confirmation Page (`/reservation-confirmation`): Reservation ID breakdown
- [ ] About Page (`/about`) & Contact Page (`/contact`): Live contact info & interactive map

## Phase 6: Admin Management Portal
- [ ] Admin Login (`/admin/login`): Clean dark blue authentication interface
- [ ] Admin Dashboard (`/admin/dashboard`): Key stats, available/reserved tables, quick actions
- [ ] Admin Products (`/admin/products`): Grid/table view, add/edit drawer, 4-image uploader, delete modal
- [ ] Admin Categories (`/admin/categories`): Category management
- [ ] Admin Offers (`/admin/offers`): Offer pricing & duration controller
- [ ] Admin Tables (`/admin/tables`): Visual 7-table layout, status toggles, Release Table button
- [ ] Admin Reservations (`/admin/reservations`): Filterable reservation list, calendar view, status actions (Accept, Complete, No Show)
- [ ] Admin Orders (`/admin/orders`): Operational order log
- [ ] Admin Settings (`/admin/settings`): Live contact editor & **"Test WhatsApp Connection"** button

## Phase 7: Verification & Testing
- [ ] Verify dynamic phone & WhatsApp propagation when updated in Settings
- [ ] Test 7-table reservation capacity & 1-hour overlap protection rules
- [ ] Test product Cloudinary 4-image limit & deletion cleanup
- [ ] Verify Nodemailer email dispatch
- [ ] Test production build (`npm run build`)
