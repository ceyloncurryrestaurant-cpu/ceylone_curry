# CEYLON CURRY — Product Requirement Document (PRD)

## 1. PROJECT OVERVIEW
Build a production-quality premium restaurant web application for **Ceylon Curry**.

### Customer Website
- Explore restaurant, brand story, authentic Sri Lankan cuisine
- View product menu, search, filter, sort, view product details
- Add food items to cart & checkout
- Send complete order directly to restaurant WhatsApp
- View daily offers & discounts
- Reserve a restaurant table (7 tables total)
- Receive reservation confirmation by email
- Contact restaurant & view dynamic opening hours/address/phones

### Admin Dashboard
- Protected Admin Login
- Manage products (CRUD, up to 4 Cloudinary images, offers)
- Manage categories
- Manage daily offers
- Manage reservations & status (Pending, Accepted, Cancelled, Completed, No Show)
- Manage 7 restaurant tables & release tables
- Centralized Settings Management (Mobile Number, WhatsApp Number, Restaurant Email, Admin Email, Address, Opening Hours, Social Links)

---

## 2. BRAND INFORMATION & DESIGN DIRECTION
- **Restaurant Name:** Ceylon Curry
- **Address:** 44 Mayflower St, Plymouth PL1 1QX
- **Current Phone:** 01752 941504
- **Visual Identity Palette:**
  - Primary Blue: `#061B8F`
  - Premium Gold: `#F4C430`
  - Curry Red: `#D92B20`
  - Cream: `#FFF8E8`
  - White: `#FFFFFF`
  - Dark Text: `#171717`
- **Atmosphere:** Premium + Authentic + Warm + Elegant + Sri Lankan + Modern

---

## 3. TECHNOLOGY STACK
- **Frontend:** Next.js (App Router), TypeScript, React, Tailwind CSS
- **Backend:** Next.js Route Handlers / API
- **Database:** MongoDB (Mongoose)
- **Image Storage:** Cloudinary (Max 4 images per product)
- **Email:** Nodemailer (Reservation confirmations & admin notifications)
- **Ordering:** WhatsApp deep-link integration
- **Auth:** Admin-only HTTP-only Cookie / JWT authentication

---

## 4. PUBLIC & ADMIN PAGES
### Public Website
1. Home (`/`)
2. Menu (`/menu`)
3. Product Details (`/menu/[id]`)
4. Offers (`/offers`)
5. Cart (`/cart`)
6. Checkout (`/checkout`)
7. Reserve a Table (`/reserve`)
8. Reservation Confirmation (`/reservation-confirmation`)
9. About (`/about`)
10. Contact (`/contact`)

### Admin Portal
11. Admin Login (`/admin/login`)
12. Admin Dashboard (`/admin/dashboard`)
13. Products (`/admin/products`)
14. Categories (`/admin/categories`)
15. Offers (`/admin/offers`)
16. Reservations (`/admin/reservations`)
17. Tables (`/admin/tables`)
18. Orders (`/admin/orders`)
19. Settings (`/admin/settings`)

---

## 5. CENTRALIZED DYNAMIC SETTINGS REQUIREMENT
All contact details (mobile, WhatsApp, email, address, opening hours) MUST be retrieved from the central `Settings` database model.
When the admin updates the mobile or WhatsApp number in **Admin -> Settings**, the update MUST immediately propagate across:
- Header Call & Mobile Menu buttons
- Footer & Contact page
- WhatsApp button & Checkout WhatsApp destination
- Reservation confirmation emails & Admin dashboard
No code modification or redeployment required.

---

## 6. TABLE RESERVATION & OVERLAP PROTECTION
- **7 Tables total:**
  - Table 1 - 4: Couple Tables (Capacity: 2)
  - Table 5 - 7: Family Tables (Capacity: 4)
- **Rules:**
  - 1-hour protected reservation window per booking
  - Concurrent double-booking prevention on backend
  - Guest count cannot exceed table capacity
  - Admin can update status to Accepted, Cancelled, Completed, No Show
  - "Release Table" button allows immediate re-booking if guest cancels/no-show

---

## 7. MONGODB COLLECTIONS
1. `Admin` (email, passwordHash, name)
2. `Product` (name, slug, categoryId, shortDescription, description, price, originalPrice, ingredients, allergens, images[max 4], isAvailable, isFeatured, isOffer, offerPrice, discountPercentage, offerStartDate, offerEndDate)
3. `Category` (name, slug, description, image, displayOrder, isActive)
4. `Table` (tableNumber, capacity, type, status, isActive)
5. `Reservation` (reservationNumber, customerName, email, mobile, tableId, date, startTime, endTime, guestCount, specialRequest, status)
6. `Order` (orderNumber, customerName, email, mobile, address, items, subtotal, discount, total, notes, whatsappStatus)
7. `Settings` (restaurantName, address, mobileNumber, whatsappNumber, restaurantEmail, adminEmail, openingHours, socialLinks, currency, reservationSettings)
