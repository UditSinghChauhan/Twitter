# 🐦 Twitter Clone — Full-Stack Social Media Platform

A full-stack Twitter-style micro-blogging platform built with **Next.js 13**, **Apollo GraphQL**, **Prisma ORM**, **PostgreSQL**, **Redis**, and **AWS S3**.

> **Disclosure:** The core authentication and tweet-posting scaffold was built while following [Piyush Garg's Full-Stack Twitter Clone course](https://www.youtube.com/watch?v=aXP76h8OMmI). Everything listed under [My Additions](#-my-additions-beyond-the-course) was designed, implemented, and tested independently.

---

## ✨ Live Preview

| Home Feed | User Profile |
|:---------:|:------------:|
| ![Home Feed](./docs/home-feed.jpg) | ![Profile](./docs/user-profile.jpg) |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT (Next.js 13)                 │
│  React · TypeScript · Tailwind CSS · React Query         │
│  GraphQL Code Generator · Google OAuth                   │
└────────────────────────┬─────────────────────────────────┘
                         │ GraphQL (HTTP)
┌────────────────────────▼─────────────────────────────────┐
│                  SERVER (Express + Apollo Server v4)      │
│  TypeScript · JWT Auth · Redis Caching · Rate Limiting   │
└───────┬───────────────────────┬──────────────┬───────────┘
        │                       │              │
   ┌────▼────┐           ┌─────▼─────┐  ┌─────▼─────┐
   │ Postgres │           │   Redis   │  │  AWS S3   │
   │ (Prisma) │           │  (Cache)  │  │ (Images)  │
   └──────────┘           └───────────┘  └───────────┘
```

---

## 🛠️ Tech Stack

| Layer           | Technology                                            |
|:----------------|:------------------------------------------------------|
| **Frontend**    | Next.js 13 (Pages Router), React 18, TypeScript       |
| **Styling**     | Tailwind CSS 3, react-icons                           |
| **Data Layer**  | GraphQL (graphql-request), React Query, GraphQL Codegen |
| **Auth**        | Google OAuth 2.0 (@react-oauth/google), JWT           |
| **Backend**     | Express 4, Apollo Server v4, TypeScript               |
| **Database**    | PostgreSQL with Prisma ORM                            |
| **Caching**     | Redis (ioredis) — tweet cache + rate limiting          |
| **Storage**     | AWS S3 (presigned URL uploads via AWS SDK v3)          |
| **DevOps**      | Docker, Docker Compose                                |

---

## 🚀 Features

### Core (from course)
- 🔐 **Google OAuth** sign-in / sign-up with automatic user provisioning
- 📝 **Create tweets** with text and optional image attachments
- 📷 **Direct-to-S3 image upload** via presigned URLs
- 👤 **User profiles** with follower / following counts
- ➕ **Follow / Unfollow** users
- 🤝 **"Who to follow" recommendations** — 2nd-degree social graph algorithm with Redis caching
- 🔄 **Server-side rendering** (SSR) for feed and profiles

### 🎯 My Additions Beyond the Course
- ❤️ **Like / Unlike tweets** — optimistic UI, deduplicated via `@@unique` composite key
- 💬 **Comments system** — lazy-loaded accordion, inline reply form (280 char limit)
- 🗑️ **Author-checked tweet deletion** — server validates `authorId === currentUser` before delete
- 🔒 **JWT expiry fix** — tokens now expire after 7 days (course version had no expiry)
- ⚡ **Redis rate limiting** — 10-second cooldown per user on tweet creation
- 🚫 **Custom 404 & 500 error pages** — branded error screens with navigation back to home
- 📱 **Responsive sidebar** — collapsible navigation with mobile-friendly icon-only mode
- 🚪 **Logout flow** — clears JWT from localStorage and invalidates React Query cache
- 📄 **Placeholder pages** — Explore, Notifications, Messages, Bookmarks stubs
- ⏰ **Relative timestamps** — Twitter-style "2h", "3d" time formatting

---

## 📁 Project Structure

```
Twitter/
├── docker-compose.yml          # One-command local orchestration
├── README.md
├── .gitignore
│
├── twitter-server/             # ─── Backend ────────────────────
│   ├── prisma/
│   │   ├── schema.prisma       # 5 models: User, Tweet, Follows, Like, Comment
│   │   └── migrations/         # 4 PostgreSQL migrations (May 2023)
│   ├── src/
│   │   ├── index.ts            # Express server entry (port 8000)
│   │   ├── app/
│   │   │   ├── index.ts        # Apollo Server setup + JWT context middleware
│   │   │   ├── tweet/          # Tweet GraphQL types, queries, mutations, resolvers
│   │   │   └── user/           # User GraphQL types, queries, mutations, resolvers
│   │   ├── services/
│   │   │   ├── jwt.ts          # JWT sign (7d expiry) + verify
│   │   │   ├── tweet.ts        # CRUD, likes, comments, Redis caching & rate limiting
│   │   │   └── user.ts         # Google OAuth verification, follow/unfollow
│   │   └── clients/
│   │       ├── db/             # Prisma client singleton
│   │       └── redis/          # ioredis client singleton
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── twitter-client/             # ─── Frontend ───────────────────
    ├── pages/
    │   ├── index.tsx           # Home feed with tweet composer & S3 upload
    │   ├── [id].tsx            # User profile with follow/unfollow
    │   ├── 404.tsx             # Custom 404 error page
    │   ├── 500.tsx             # Custom 500 error page
    │   └── explore|notifications|messages|bookmarks.tsx
    ├── components/
    │   └── FeedCard/
    │       ├── index.tsx       # Tweet card: likes, comments, delete, timestamps
    │       └── Layout/
    │           └── TwitterLayout.tsx  # 3-column responsive shell with nav + sidebar
    ├── graphql/
    │   ├── mutation/            # Tweet & User GraphQL mutation documents
    │   └── query/               # Tweet & User GraphQL query documents
    ├── hooks/
    │   ├── tweet.ts            # React Query hooks for all tweet operations
    │   └── user.ts             # React Query hook for current user
    ├── clients/
    │   └── api.ts              # GraphQL client with JWT auth header injection
    ├── gql/                    # Auto-generated types (GraphQL Codegen)
    ├── utils/
    │   └── timeAgo.ts          # Relative timestamp formatter
    ├── styles/
    │   └── globals.css         # Tailwind base + dark theme
    ├── .env.example
    ├── codegen.ts
    ├── package.json
    └── tailwind.config.js
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Yarn** (preferred) or npm
- **PostgreSQL** 14+
- **Redis** 7+
- **AWS Account** with an S3 bucket (for image uploads)
- **Google Cloud Console** project with OAuth 2.0 Client ID

### Option 1 — Docker Compose (Recommended)

> Spin up the entire stack (Postgres, Redis, server, client) with a single command.

```bash
# 1. Clone the repo
git clone https://github.com/UditSinghChauhan/Twitter.git
cd Twitter

# 2. Create environment files
cp twitter-server/.env.example twitter-server/.env
cp twitter-client/.env.example twitter-client/.env

# 3. Edit the .env files with your actual credentials
#    (see Environment Variables section below)

# 4. Start everything
docker compose up --build

# 5. Run database migrations (first time only)
docker compose exec server npx prisma migrate deploy
docker compose exec server npx prisma generate
```

🌐 **Client:** http://localhost:3000 &nbsp;|&nbsp; **Server/GraphQL:** http://localhost:8000/graphql

### Option 2 — Manual Setup

```bash
# 1. Clone the repo
git clone https://github.com/UditSinghChauhan/Twitter.git
cd Twitter

# 2. Set up the server
cd twitter-server
cp .env.example .env        # Edit with your credentials
yarn install
npx prisma migrate deploy   # Apply database migrations
npx prisma generate         # Generate Prisma client
yarn dev                    # Starts on http://localhost:8000

# 3. Set up the client (new terminal)
cd twitter-client
cp .env.example .env        # Edit with your credentials
yarn install
yarn dev                    # Starts on http://localhost:3000
```

---

## 🔐 Environment Variables

### Server (`twitter-server/.env`)

| Variable                | Description                              | Example                                      |
|:------------------------|:-----------------------------------------|:---------------------------------------------|
| `DATABASE_URL`          | PostgreSQL connection string             | `postgresql://user:pass@localhost:5432/twitter_db` |
| `REDIS_URL`             | Redis connection string                  | `redis://localhost:6379`                      |
| `JWT_SECRET`            | Secret for signing JWT tokens            | `your-super-secret-key-here`                 |
| `AWS_DEFAULT_REGION`    | AWS region for S3                        | `ap-south-1`                                 |
| `AWS_S3_BUCKET`         | S3 bucket name for image storage         | `my-twitter-clone-bucket`                    |
| `AWS_ACCESS_KEY_ID`     | AWS IAM access key                       | `AKIA...`                                    |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key                       | `wJal...`                                    |

### Client (`twitter-client/.env`)

| Variable               | Description                              | Example                     |
|:-----------------------|:-----------------------------------------|:----------------------------|
| `NEXT_PUBLIC_API_URL`  | URL of the GraphQL backend               | `http://localhost:8000`     |

---

## 📊 Database Schema

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │──────<│  Tweet   │──────<│   Like   │
│          │       │          │       │ (unique   │
│ id       │       │ id       │       │  per user │
│ email    │       │ content  │       │  per tweet│
│ firstName│       │ imageURL │       └──────────┘
│ lastName │       │ authorId │
│ profile  │       │ createdAt│──────<┌──────────┐
│ ImageURL │       └──────────┘       │ Comment  │
└────┬─────┘                          │          │
     │                                │ content  │
     └──────<┌──────────┐            │ authorId │
              │ Follows  │            │ tweetId  │
              │          │            └──────────┘
              │follower  │
              │following │
              └──────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
