# Shelfie — Requirements Document

> A personal book tracking app built as a portfolio project to consolidate Full Stack Open (Parts 2–7) concepts.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Goals](#goals)
3. [Tech Stack](#tech-stack)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [Data Models](#data-models)
7. [API Requirements](#api-requirements)
8. [Frontend Requirements](#frontend-requirements)
9. [Testing Requirements](#testing-requirements)
10. [Out of Scope](#out-of-scope)

---

## Project Overview

Shelfie is a full stack web application that allows authenticated users to manage a personal reading list. Users can track books they have read, are currently reading, or want to read in the future — along with personal ratings and notes.

The project is intentionally scoped to cover key concepts from Full Stack Open Parts 2–6: REST APIs, Express, PostgreSQL, JWT authentication, Redux state management, and testing at multiple layers.

---

## Goals

- Consolidate and deepen understanding of Full Stack Open Parts 2–6 through deliberate practice
- Produce a clean, well-documented portfolio project
- Practice writing documentation alongside code, not after it
- Demonstrate full stack capability: database design, REST API, auth, frontend state management, and testing

---

## Tech Stack

### Backend

| Technology                            | Purpose                                 | FSO Part |
| ------------------------------------- | --------------------------------------- | -------- |
| Node.js                               | Runtime                                 | Part 3   |
| Express.js                            | HTTP server & routing                   | Part 3   |
| PostgreSQL                            | Relational database                     | Part 3   |
| `pg` / `node-postgres`                | PostgreSQL client                       | Part 3   |
| `node-pg-migrate`                     | Database migrations                     | Part 3   |
| Zod                                   | Request validation & schema enforcement | Part 3   |
| `bcrypt`                              | Password hashing                        | Part 4   |
| `jsonwebtoken`                        | JWT generation & verification           | Part 4   |
| Node built-in test runner + Supertest | Backend integration tests               | Part 4   |

### Frontend

| Technology            | Purpose                 | FSO Part |
| --------------------- | ----------------------- | -------- |
| React                 | UI library              | Part 1   |
| React Router          | Client-side routing     | Part 2   |
| Axios                 | HTTP client             | Part 2   |
| Redux Toolkit         | Global state management | Part 6   |
| React Testing Library | Component testing       | Part 5   |
| Playwright            | End-to-end testing      | Part 5   |

### Tooling & Dev

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Vite       | Frontend build tool             |
| ESLint     | Linting                         |
| dotenv     | Environment variable management |

---

## Functional Requirements

### Authentication

- **FR-AUTH-1:** A new user can register with a unique username, email address, and password.
- **FR-AUTH-2:** A registered user can log in with their email and password.
- **FR-AUTH-3:** A logged-in user receives a JWT token used to authenticate subsequent requests.
- **FR-AUTH-4:** A logged-in user can log out, clearing their session token.
- **FR-AUTH-5:** Protected routes and API endpoints are inaccessible without a valid token.

### Book Management

- **FR-BOOK-1:** An authenticated user can add a book to their shelf with the following fields:
  - Title (required)
  - Author (required)
  - Status: `reading` | `read` | `want_to_read` (required)
  - Rating: 1–5 (optional, only valid when status is `read`)
  - Notes: free text (optional)
- **FR-BOOK-2:** An authenticated user can view all books on their shelf.
- **FR-BOOK-3:** An authenticated user can view a single book's detail page.
- **FR-BOOK-4:** An authenticated user can edit any field of a book they own.
- **FR-BOOK-5:** An authenticated user can delete a book from their shelf.
- **FR-BOOK-6:** A user can only view and manage their own books — not other users' shelves.

### Filtering & Sorting

- **FR-FILTER-1:** A user can filter their shelf by status (`reading`, `read`, `want_to_read`).
- **FR-FILTER-2:** A user can sort their shelf by date added (newest/oldest) or by title (A–Z).

---

## Non-Functional Requirements

- **NFR-1 — Security:** Passwords must be hashed with `bcrypt` before being stored. Plain text passwords must never be persisted.
- **NFR-2 — Validation:** All incoming API request bodies must be validated with Zod before reaching business logic. Invalid requests return a `400` with a descriptive error message.
- **NFR-3 — Auth middleware:** JWT verification must be handled in a dedicated middleware function applied to all protected routes — not inline in route handlers.
- **NFR-4 — Error handling:** The backend must have a centralised error-handling middleware that catches unhandled errors and returns consistent JSON error responses.
- **NFR-5 — Environment config:** All secrets (JWT secret, DB connection string) must be managed via environment variables. No secrets in source code.
- **NFR-6 — Database migrations:** All schema changes must be managed via `node-pg-migrate` migration files. The database must never be modified by hand.
- **NFR-7 — Test coverage:** Critical paths (auth flow, book CRUD) must have integration test coverage on the backend and E2E test coverage via Playwright.
- **NFR-8 — Documentation:** The README must be kept up to date with setup instructions, environment variable reference, and how to run tests.

---

## Data Models

### `users`

| Column          | Type           | Constraints             |
| --------------- | -------------- | ----------------------- |
| `id`            | `SERIAL`       | PRIMARY KEY             |
| `username`      | `VARCHAR(50)`  | NOT NULL, UNIQUE        |
| `email`         | `VARCHAR(255)` | NOT NULL, UNIQUE        |
| `password_hash` | `TEXT`         | NOT NULL                |
| `created_at`    | `TIMESTAMPTZ`  | NOT NULL, DEFAULT NOW() |

### `books`

| Column       | Type           | Constraints                                            |
| ------------ | -------------- | ------------------------------------------------------ |
| `id`         | `SERIAL`       | PRIMARY KEY                                            |
| `user_id`    | `INTEGER`      | NOT NULL, FK → users.id                                |
| `title`      | `VARCHAR(255)` | NOT NULL                                               |
| `author`     | `VARCHAR(255)` | NOT NULL                                               |
| `status`     | `VARCHAR(20)`  | NOT NULL, CHECK IN (`reading`, `read`, `want_to_read`) |
| `rating`     | `SMALLINT`     | NULLABLE, CHECK (1–5)                                  |
| `notes`      | `TEXT`         | NULLABLE                                               |
| `created_at` | `TIMESTAMPTZ`  | NOT NULL, DEFAULT NOW()                                |
| `updated_at` | `TIMESTAMPTZ`  | NOT NULL, DEFAULT NOW()                                |

---

## API Requirements

Base path: `/api`

All protected endpoints require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint             | Auth   | Description         |
| ------ | -------------------- | ------ | ------------------- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login`    | Public | Log in, receive JWT |

### Books

| Method   | Endpoint         | Auth      | Description                    |
| -------- | ---------------- | --------- | ------------------------------ |
| `GET`    | `/api/books`     | Protected | Get all books for current user |
| `GET`    | `/api/books/:id` | Protected | Get a single book by ID        |
| `POST`   | `/api/books`     | Protected | Add a new book                 |
| `PUT`    | `/api/books/:id` | Protected | Update a book                  |
| `DELETE` | `/api/books/:id` | Protected | Delete a book                  |

---

## Frontend Requirements

### Pages & Routing

| Route             | Page                        | Auth required |
| ----------------- | --------------------------- | ------------- |
| `/`               | Landing / redirect to shelf | No            |
| `/login`          | Login form                  | No            |
| `/register`       | Register form               | No            |
| `/shelf`          | User's book shelf           | Yes           |
| `/shelf/:id`      | Book detail view            | Yes           |
| `/shelf/:id/edit` | Edit book form              | Yes           |
| `/shelf/add`      | Add book form               | Yes           |

### State Management (Redux)

The following slices must be managed in Redux global store:

- **`authSlice`** — current user, token, login/logout actions
- **`booksSlice`** — books list, loading state, error state, active filters/sort

Async operations (API calls) must use Redux Toolkit's `createAsyncThunk`.

---

## Testing Requirements

### Backend (Node test runner + Supertest)

- Register endpoint — valid input creates a user; duplicate email returns 400; missing fields return 400
- Login endpoint — correct credentials return a token; wrong password returns 401
- Books CRUD — all endpoints return 401 without a token; CRUD operations work correctly with a valid token; a user cannot access another user's books

### Frontend (React Testing Library)

- Login form renders correctly and handles submission
- Book list renders books from Redux store
- Empty state renders when shelf is empty

### End-to-End (Playwright)

- User can register, log in, add a book, edit it, and delete it
- Unauthenticated user is redirected away from protected routes
- Filter by status works correctly

---

## Out of Scope

The following are explicitly excluded from v1 to keep scope manageable:

- Social features (following other users, public shelves)
- Book cover images or external book search APIs (e.g. Google Books)
- Reading progress tracking (page numbers, % complete)
- Email verification or password reset flow
- Mobile app
- Deployment / CI pipeline (may be added as a stretch goal)
