# 📘 Project Overview: USOF Backend

## 1. Introduction

This project implements the backend for a Q&A-style platform inspired by StackOverflow, designed for programmers. The system allows users to register, create posts, comment, like, favorite, subscribe to content, and mark solutions. The backend is built with Node.js and Express, following an MVC-inspired structure with clear separation of concerns between routes, controllers, models, and services.

---

## 2. System Architecture

- **Runtime:** Node.js (ES modules)
- **Framework:** Express.js
- **Database:** MySQL (relational schema, foreign keys, constraints)
- **Admin Panel:** AdminJS for database visualization and management
- **Security:** Sessions, password hashing, email verification, password reset tokens
- **File Storage:** Local `/uploads` for avatars and post images

---

## 3. Folder Structure

```
src/
├── admin/              # AdminJS setup and error handling
├── config/             # App configuration
├── controllers/        # Business logic and request handling
├── db/                 # Connection, schema, and initialization
├── middleware/         # Authentication and other middlewares
├── models/             # Data models for users, posts, etc.
├── routes/             # REST API endpoint definitions
├── services/           # Helper services (email)
├── utils/              # Utility functions
└── validation/         # Input validation schemas
```

- **Controllers:** Process HTTP requests, call models, and return responses
- **Models:** Communicate with the database, encapsulating SQL queries
- **Routes:** Map HTTP endpoints to controller methods
- **Services:** Handle reusable logic (e.g., email sending, tokens)
- **Middleware:** Provide request-level functionality (auth checks, validation)

---

## 4. Database Schema

The database schema is relational and normalized. Key entities:

- **Users**: Authentication, roles (`user`, `admin`), rating, profile picture
- **Posts**: Title, content, status (`active`, `inactive`), solution reference
- **Categories**: Organize posts into groups
- **Post-Categories**: Junction table for many-to-many relation
- **Comments**: Linked to posts, can be marked as solution
- **Likes**: Support for likes/dislikes on both posts and comments
- **Favorites**: Users can save posts to their favorites
- **Post Subscriptions**: Users subscribe to posts for updates
- **Email Verification Tokens / Password Reset Tokens**: For authentication flows

### Example Relations:

- One **user** → many **posts**
- One **post** → many **comments**
- One **user** can like many posts and comments, but only once per item (unique constraint)
- Many-to-many between **posts** and **categories**

---

## 5. Key Features

### Core Features

- User authentication with email verification and password reset
- Post creation, editing, deletion with category assignment
- Comment system with active/inactive status
- Like/dislike system with automatic `like_count` recalculation
- Marking a comment as the solution for a post
- File upload support for avatars and post images

### Creative Features

- **Favoriting posts:** Users can save posts to personal favorites
- **Subscribing to posts:** Notifications when new comments appear
- **Solution marking:** Highlighting accepted answers for clarity

---

## 6. API Endpoints (Overview)

- **Auth:** `/api/auth/*` – register, login, email verification, password reset
- **Users:** `/api/users/*` – manage profiles, avatars, roles
- **Posts:** `/api/posts/*` – CRUD, list with filters, solution marking, subscriptions, favorites
- **Comments:** `/api/comments/*` – CRUD, mark as solution candidate
- **Categories:** `/api/categories/*` – CRUD for post categories
- **Likes:** integrated into posts and comments endpoints

Each route connects to a controller, which uses models for database access. Responses are JSON.

---

## 7. Challenge-Based Learning (CBL) Stages

### Engage

The challenge was to build a backend system similar to StackOverflow, focusing on structured code, clean architecture, and real-world functionality for a programming Q&A platform.

### Investigate

- Researched MVC and Express best practices
- Studied relational schema design for Q&A platforms
- Analyzed existing solutions (StackOverflow, Reddit-like systems) for inspiration

### Act

- Implemented models, controllers, and routes step by step
- Created normalized database schema with foreign keys and constraints
- Built authentication, posts, comments, and interactions (likes, favorites, subscriptions)
- Integrated AdminJS for administration
- Added email verification and password reset flows

### Document

- Structured `/docs/overview.md` with project explanation
- Organized folder structure according to MVC separation

---
