# System Design & Entity Relationship Architecture

## Overview
**IndieGamer Hub** is built on a modular Node.js/Express + MongoDB backend and Vite/React frontend architecture. The database design optimizes for high-speed discovery and social engagement by combining MongoDB schemas with cached aggregate statistics.

---

## 1. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ GAME : "publishes (as Developer)"
    USER ||--o{ REVIEW : "writes (1 per game)"
    USER ||--o{ THREAD : "authors"
    USER ||--o{ POST : "posts reply"
    USER ||--o{ GAME : "saves to wishlist"

    GAME ||--o{ REVIEW : "has reviews"
    GAME ||--o{ THREAD : "has forum threads"

    THREAD ||--o{ POST : "contains posts/replies"

    USER {
        ObjectId _id PK
        String name
        String email
        String password
        String role "gamer | developer | admin"
        String avatar
        String bio
        Array savedGames "references Game"
        Date createdAt
    }

    GAME {
        ObjectId _id PK
        String title
        String description
        String shortDescription
        Array genre "e.g. Action, Metroidvania"
        String releaseDate
        ObjectId developerId FK "references User"
        String developerName
        String steamAppId
        Number price
        String headerImage
        Array screenshots
        String trailerUrl
        Array storeLinks "store & url"
        Boolean isFeatured "Spotlight Hero"
        Number averageRating "Cached Aggregation"
        Number reviewCount "Cached Count"
        Number affiliateClicks "Tracking"
    }

    REVIEW {
        ObjectId _id PK
        ObjectId gameId FK "references Game"
        ObjectId userId FK "references User"
        String userName
        String userAvatar
        Number rating "1 to 5 Stars"
        String title
        String content
        Date createdAt
    }

    THREAD {
        ObjectId _id PK
        ObjectId gameId FK "references Game"
        ObjectId authorId FK "references User"
        String authorName
        String title
        String content
        Boolean pinned
        Number postCount
        Date lastActivity
    }

    POST {
        ObjectId _id PK
        ObjectId threadId FK "references Thread"
        ObjectId authorId FK "references User"
        String authorName
        String content
        Date createdAt
    }
```

---

## 2. Average Rating Aggregation Pipeline

Whenever a review is created or deleted, an Express middleware triggers the following **MongoDB Aggregation Pipeline**:

```javascript
const stats = await Review.aggregate([
  { $match: { gameId: new mongoose.Types.ObjectId(gameId) } },
  {
    $group: {
      _id: '$gameId',
      averageRating: { $avg: '$rating' },
      reviewCount: { $sum: 1 }
    }
  }
]);

await Game.findByIdAndUpdate(gameId, {
  averageRating: Math.round(stats[0].averageRating * 10) / 10,
  reviewCount: stats[0].reviewCount
});
```

> **Performance Benefit**: Pre-computing and caching `averageRating` on the `Game` collection allows single-index query sorting for catalog discovery (e.g. `Game.find().sort({ averageRating: -1 })`) without executing expensive joins at read time.

---

## 3. External API Service Architecture (`services/steamApi.js`)

```
   +-----------------------+
   |   React Frontend      |
   | (Paste Steam App ID)  |
   +-----------+-----------+
               |
               v GET /api/games/steam-preview/:appId
   +-----------+-----------+
   |   Express Backend     |
   | (services/steamApi.js)|
   +-----------+-----------+
               |
        +------+------+
        |             |
        v             v
 [Local Cache]   [Steam API]
 (Instant AppId) (store.steampowered.com)
        |             |
        +------+------+
               |
               v
   Auto-filled Metadata Payload
   (Title, Price, Genres, Header, Screenshots)
```

---

## 4. Monetization & Affiliate Tracking Flow

1. Admin toggles `isFeatured = true` on high-priority games in `/admin`.
2. Landing page queries `GET /api/games/featured` to render hero spotlight carousel.
3. Gamer clicks **Buy Now on Steam/Itch.io**.
4. Request routes through `GET /api/affiliate/redirect?gameId=...&store=Steam`.
5. Backend increments `affiliateClicks` metric on the `Game` document.
6. Server responds with target affiliate URL (`https://store.steampowered.com/app/367520/?utm_source=indiegamerhub&aff_id=IGH2026`).
