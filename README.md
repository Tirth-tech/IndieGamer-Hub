# IndieGamer Hub - Community & Discovery Platform for Indie Games

"IndieGamer Hub" is a dedicated discovery engine and social space designed for indie game lovers and independent developers. Built with Node.js, Express, MongoDB, and Vite/React, it mimics the functionality of sites like Itch.io and GameJolt while offering Steam API syncing, cached review aggregations, per-game discussion forums, interactive media galleries, and monetization spotlight features.

---

## 🌟 Key Features

1. **Steam Storefront API Integration (`services/steamApi.js`)**:
   - Developers can paste a Steam App ID (e.g. `367520` for *Hollow Knight*, `1145360` for *Hades*) to automatically import live prices, release dates, genres, header banners, and screenshot galleries.

2. **Cached Review & Rating Aggregation**:
   - Gamers can rate games from 1-5 stars and write reviews.
   - An aggregation pipeline recalculates `averageRating` and `reviewCount` whenever a review is posted or removed, storing the cached value directly on the `Game` model for sorting performance.

3. **Per-Game Community Forums (`Game` -> `Threads` -> `Posts`)**:
   - Dedicated discussion board per game.
   - Pinned threads, last activity timestamps, and reply posts.

4. **Sleek Dark Mode Aesthetic & Visual Discovery**:
   - Dark-mode default gaming UI built with Google Fonts (`Press Start 2P`, `Outfit`, `Inter`).
   - Hero Spotlight Carousel with quick trailer video preview modal (powered by `react-player`).
   - Interactive Screenshot Gallery Carousel with fullscreen lightbox viewer.
   - Advanced catalog search, multi-select genre filters, price range filters, and sorting.

5. **Monetization & Admin Panel**:
   - Admin dashboard with `isFeatured` toggles to give priority rendering to spotlight games on the homepage.
   - Affiliate link redirection tracking for "Buy Now" storefront buttons (`/api/affiliate/redirect`).

---

## 📁 Repository Structure

```
w2/
├── backend/
│   ├── config/          # Database connection (Mongo + Memory Server fallback)
│   ├── controllers/     # Auth, Game, Review, Forum controllers
│   ├── middleware/      # JWT authentication & Role authorization
│   ├── models/          # User, Game, Review, Thread, Post Mongoose models
│   ├── routes/          # Express route definitions
│   ├── services/        # Steam API integration service (steamApi.js)
│   ├── seed.js          # Database seeder with popular indie games & reviews
│   ├── test_api.js      # Automated backend verification test script
│   ├── server.js        # Express application entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, GameCard, HeroCarousel, ScreenshotGallery, ForumSection
│   │   ├── context/     # AuthContext state management
│   │   ├── pages/       # Home, Catalog, GameDetail, AddGame, AdminDashboard, Login, Register
│   │   ├── index.css    # Dark mode gaming design system
│   │   ├── App.jsx      # Main application router
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── SYSTEM_DESIGN.md     # ERD diagram & system architecture documentation
└── README.md            # Project overview & execution guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Run the Backend API

```bash
cd backend
npm install
npm run seed     # Populate database with rich sample indie games & reviews
npm start        # Starts API server on http://localhost:5000
```

> **Note**: If `MONGODB_URI` environment variable is not defined, the server will automatically launch an in-memory MongoDB instance (`mongodb-memory-server`) for zero-config execution!

To run automated backend verification tests:
```bash
npm run test:api
```

### 2. Run the Frontend App

```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:3000
```

---

## 🔑 Demo Accounts

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@indiegamerhub.com` | `adminpassword123` | Toggle `isFeatured` spotlight games, view affiliate stats |
| **Developer** | `dev@teamcherry.com` | `devpassword123` | Publish games, import via Steam App ID |
| **Gamer** | `alex@gamer.com` | `gamerpassword123` | Post reviews, rate 1-5 stars, start forum discussions |
