# Ceylon Curry — Implementation & Verification Walkthrough

The production-quality web application for **Ceylon Curry** is complete and connected to your local MongoDB instance.

---

## 1. Local MongoDB Seed Verification

The database seed script connected to `mongodb://127.0.0.1:27017/ceylon_curry` and populated all required collections:

- **Settings Collection:** Initialized with dynamic restaurant credentials (`01752 941504`, `+447824110369`, `44 Mayflower St, Plymouth PL1 1QX`).
- **Admin User:** Created `admin@ceyloncurry` with hashed password `ceyloncurry@3443`.
- **7 Restaurant Tables:**
  - Table 1 – 4: Couple Tables (Capacity: 2)
  - Table 5 – 7: Family Tables (Capacity: 4)
- **Categories & Dishes:** Starters, Kottu, Rice & Biryani, Curries, Seafood, Vegetarian, Desserts, Drinks, plus active daily special offer items.

---

## 2. Implemented Features Overview

### Customer Website
1. **Homepage (`/`):**
   - Hero section: Tagline **"Authentic Ceylon Flavours"**, primary CTAs **"Explore Menu"** & **"Reserve a Table"**.
   - **"A Taste of Ceylon"** two-column restaurant story.
   - **"Our Favourites"** menu grid featuring top dishes.
   - **"Today's Special Offers"** showcase section with discount percentages.
   - **"Why Choose Ceylon Curry"** feature blocks (Authentic Flavours, Fresh Ingredients, Traditional Recipes, Warm Hospitality).
   - **"Your Table Awaits"** table reservation CTA.
   - Dynamic Contact & Location card pulling live settings.

2. **Menu Catalog (`/menu`):**
   - Real-time search by dish name, description, or ingredients.
   - Category pill selector (All, Starters, Kottu, Rice & Biryani, Curries, Seafood, Vegetarian, Desserts, Drinks).
   - Offer toggle & sorting (Featured, Price Low → High, Price High → Low, Name A → Z).

3. **Product Detail View (`/menu/[id]`):**
   - Cloudinary thumbnail gallery switcher (up to 4 images).
   - Dynamic price/discount display, ingredients list, allergen notices, quantity controls, and Add to Cart action.

4. **Daily Offers Page (`/offers`):**
   - Dedicated deals page showing discount percentages and real savings.

5. **Cart & Checkout (`/cart`, `/checkout`):**
   - Line-item quantity modifiers, item removal, discount calculator.
   - Checkout form validation (Full name, valid email, mobile, delivery address).
   - Server-side price revalidation against MongoDB (`/api/orders`), order logging, and direct WhatsApp message deep-link generation.

6. **7-Table Interactive Reservation (`/reserve`, `/reservation-confirmation`):**
   - Date & Time pickers with live 1-hour overlap window availability checking.
   - Interactive visual floor plan of all 7 tables (Tables 1-4 Couple 2-seat, Tables 5-7 Family 4-seat).
   - Guest capacity validation (blocking >2 guests for Couple tables).
   - Unique reference ID generation (`CC-YYYYMMDD-XXX`) & Nodemailer confirmation emails.

7. **About (`/about`) & Contact (`/contact`):**
   - Restaurant heritage story & dynamic contact info card.

---

### Admin Portal & Operational Management
1. **Admin Login (`/admin/login`):**
   - Dark royal blue interface with HTTP-only cookie JWT session authentication (`admin@ceyloncurry` / `ceyloncurry@3443`).

2. **Dashboard (`/admin/dashboard`):**
   - Metrics cards: Total Products, Active Offers, Today's Reservations, Pending Review, Available Tables, Reserved Tables, WhatsApp Orders Log.

3. **Product CRUD (`/admin/products`):**
   - Add/Edit product drawer with max 4 Cloudinary images uploader, daily offer toggle, ingredients/allergens inputs.
   - Delete confirmation modal with Cloudinary asset cleanup.

4. **Category Manager (`/admin/categories`) & Offers (`/admin/offers`):**
   - Menu categorization and active deal duration manager.

5. **7-Table Floor Plan Manager (`/admin/tables`):**
   - Real-time status for Tables 1-7 with **"Release Table"** and **"Mark Occupied"** actions.

6. **Reservations Manager (`/admin/reservations`):**
   - Filterable bookings list with status updates: Accept, Complete, Cancel, or **"Mark No Show"** (auto-releasing table availability).

7. **Centralized Settings Control Panel (`/admin/settings`):**
   - Single source of truth for restaurant mobile number, WhatsApp destination, email, address, and opening hours.
   - Includes **"Test WhatsApp Connection"** button.
   - On save, updates database record and instantly propagates changes across the entire site without redeployment.

---

## 3. How to Run & Verify

1. **Development Server:**
   ```bash
   node node_modules/next/dist/bin/next dev
   ```
2. **Access Links:**
   - Public Website: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login` (`admin@ceyloncurry` / `ceyloncurry@3443`)
   - Admin Settings: `http://localhost:3000/admin/settings`
