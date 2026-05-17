# CampusNest

**Student Accommodation Discovery & Management System**
IT2234 — Web Services & Technology · ICA-03
A. Nivetha · 2022ICT112 · University of Vavuniya

---

## About

CampusNest helps university students find safe, verified, affordable accommodation near campus, and gives landlords a platform built for their workflow. The system uses JWT-based role authentication, owner-managed listings, online reservations, student reviews, and admin moderation through a report system.

The project is a full-stack web application composed of two independently runnable parts: a Node + Express + MongoDB REST API, and a React + Vite single-page frontend that consumes it.

## Tech stack

| Layer    | Technology                                                |
| -------- | --------------------------------------------------------- |
| Frontend | React 19 (Vite), React Router, Axios, Context API         |
| Backend  | Node.js, Express 5, JSON Web Tokens, bcryptjs, CORS       |
| Database | MongoDB with Mongoose ODM                                 |
| Tooling  | Postman, MongoDB Compass, VS Code, Git, ESLint, nodemon   |

## Project structure

```
Ica-3/
├── CampusNest/                    Backend — REST API
│   ├── config/                    Mongo connection helper
│   ├── controllers/               Auth, listing, reservation, review, report, wishlist, admin
│   ├── middleware/                JWT auth + global error handler
│   ├── models/                    User, Listing, Reservation, Review, Report, Wishlist
│   ├── routes/                    /api/auth, /api/listings, /api/reviews, /api/reservations,
│   │                              /api/wishlist, /api/reports, /api/admin
│   ├── .env.example               Template for required environment variables
│   ├── package.json
│   └── server.js                  Entry point
│
└── campusnest-frontend/           Frontend — React SPA
    ├── public/
    ├── src/
    │   ├── api/                   Axios instance with auth interceptor
    │   ├── components/            Navbar, Footer, ListingCard
    │   ├── context/               AuthContext (token + user persistence)
    │   ├── pages/                 10 pages: Home, Login, Register, Listings,
    │   │                          SingleListing, AddListing, EditListing,
    │   │                          MyReservations, MyWishlist, OwnerDashboard,
    │   │                          AdminDashboard
    │   ├── App.jsx                Routing + route guards
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Prerequisites

You will need these installed locally before running the project:

- **Node.js** version 18 or higher (`node --version`)
- **npm** version 9 or higher (`npm --version`)
- **MongoDB** running locally on the default port `27017`, or a MongoDB Atlas connection string

## Quick start

The backend and frontend run in two separate terminals. Both must be running for the app to work.

### 1. Install dependencies

```bash
cd CampusNest
npm install

cd ../campusnest-frontend
npm install
```

### 2. Configure environment variables

Inside the `CampusNest` folder, copy the example file and fill in your values:

```bash
cd CampusNest
cp .env.example .env
```

Then open `.env` and set each variable — see the **Environment variables** section below for what each one means.

The frontend does not need a `.env` file. It calls the backend at `http://localhost:5000` by default. To change that, edit `campusnest-frontend/src/api/axios.js`.

### 3. Run the backend

```bash
cd CampusNest
npm run dev
```

Server starts on `http://localhost:5000`. You should see `CampusNest Server running on port 5000` in the terminal and a successful MongoDB connection message.

### 4. Run the frontend

In a separate terminal:

```bash
cd campusnest-frontend
npm run dev
```

Vite serves the app on `http://localhost:5173`. Open that URL in a browser.

## Environment variables

The backend reads these from `CampusNest/.env`:

| Variable          | Purpose                                                       | Example                                       |
| ----------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `PORT`            | Port the Express server listens on                            | `5000`                                        |
| `MONGO_URI`       | MongoDB connection string                                     | `mongodb://localhost:27017/campusnest`        |
| `NODE_ENV`        | Runtime environment                                           | `development`                                 |
| `JWT_SECRET`      | Signing key for issued JWT tokens — use a long random string  | `change-me-to-a-random-32-char-string`        |
| `JWT_EXPIRE`      | Token lifetime                                                | `30d`                                         |
| `ADMIN_SEED_KEY`  | Secret required to call `POST /api/auth/seed-admin`           | `change-me-too`                               |

**Never commit `.env` to git.** It is already listed in `.gitignore`. The `.env.example` file is safe to commit because it contains placeholder values only.

## Creating the admin account

Admin accounts cannot be created through public registration — the registration endpoint explicitly refuses any request with `role: "admin"`. Instead, use the seeded admin endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CampusNest Admin",
    "email": "admin@campusnest.lk",
    "password": "YourStrongPass@123",
    "secretKey": "<value of ADMIN_SEED_KEY from your .env>"
  }'
```

This endpoint creates an admin if none exists, or updates the existing one. The endpoint refuses the request unless the `secretKey` field matches `ADMIN_SEED_KEY` in `.env`.

## Available scripts

### Backend (`CampusNest/`)

| Command       | What it does                                |
| ------------- | ------------------------------------------- |
| `npm run dev` | Start with `nodemon` for hot reload         |
| `npm start`   | Start with plain `node` for production-like |

### Frontend (`campusnest-frontend/`)

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server on `:5173`  |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Serve the production build locally    |
| `npm run lint`    | Run ESLint over the `src/` tree       |

## API overview

All routes are prefixed with `/api`. Routes marked **protected** require a `Bearer <token>` header. Routes marked **admin** additionally require the authenticated user to have `role: "admin"`.

| Group          | Endpoint                          | Method | Access     |
| -------------- | --------------------------------- | ------ | ---------- |
| Auth           | `/auth/register`                  | POST   | public     |
| Auth           | `/auth/login`                     | POST   | public     |
| Auth           | `/auth/profile`                   | GET    | protected  |
| Auth           | `/auth/seed-admin`                | POST   | keyed      |
| Listings       | `/listings`                       | GET    | public     |
| Listings       | `/listings/:id`                   | GET    | public     |
| Listings       | `/listings`                       | POST   | protected  |
| Listings       | `/listings/my`                    | GET    | protected  |
| Listings       | `/listings/:id`                   | PUT    | owner-only |
| Listings       | `/listings/:id`                   | DELETE | owner-only |
| Reservations   | `/reservations/:listingId`        | POST   | protected  |
| Reservations   | `/reservations/student/:uniId`    | GET    | protected  |
| Reservations   | `/reservations/:id`               | PUT    | protected  |
| Reviews        | `/reviews/:listingId`             | POST   | protected  |
| Reviews        | `/reviews/:listingId`             | GET    | public     |
| Reports        | `/reports/:listingId`             | POST   | protected  |
| Reports        | `/reports/listing/:listingId`     | GET    | public     |
| Admin          | `/admin/stats`                    | GET    | admin      |
| Admin          | `/admin/users`                    | GET    | admin      |
| Admin          | `/admin/users/:id`                | DELETE | admin      |
| Admin          | `/admin/reports`                  | GET    | admin      |
| Admin          | `/admin/reports/:id`              | PUT    | admin      |
| Admin          | `/admin/listings/:id`             | DELETE | admin      |

## Database collections

Six Mongoose collections back the API:

- **Users** — name, email, hashed password, role (`student | owner | admin`), `universityId` for students
- **Listings** — name, type, address, capacity, rules, payment terms, meals, facilities, owner reference
- **Reservations** — listing reference, student name, move-in date, duration, status (`pending | approved | rejected`)
- **Reviews** — listing reference, student name, five sub-ratings, comment, would-recommend flag
- **Reports** — listing reference, reason (enum of 7 categories), description, status, reporter contact
- **Wishlist** — per-student array of saved listing IDs

## Role permissions

| Action                                 | Public | Student | Owner | Admin |
| -------------------------------------- | :----: | :-----: | :---: | :---: |
| Browse listings, view details          |   ✓    |    ✓    |   ✓   |   ✓   |
| Read reviews                           |   ✓    |    ✓    |   ✓   |   ✓   |
| Register an account                    |   ✓    |    —    |   —   |   —   |
| Reserve a room                         |   —    |    ✓    |   —   |   —   |
| Write a review                         |   —    |    ✓    |   —   |   —   |
| Save to wishlist                       |   —    |    ✓    |   —   |   —   |
| Submit a report                        |   —    |    ✓    |   —   |   —   |
| Create a listing                       |   —    |    —    |   ✓   |   ✓   |
| Edit / delete own listing              |   —    |    —    |   ✓   |   —   |
| Approve / reject reservation requests  |   —    |    —    |   ✓   |   —   |
| View any user / listing / report       |   —    |    —    |   —   |   ✓   |
| Force-delete any listing               |   —    |    —    |   —   |   ✓   |
| Moderate report status                 |   —    |    —    |   —   |   ✓   |

## Troubleshooting

**Backend exits immediately on startup.** Check that `MONGO_URI` in `.env` points to a running MongoDB instance. If you do not have MongoDB installed locally, sign up for a free MongoDB Atlas cluster and paste its connection string into `.env`.

**Frontend shows network errors on every API call.** Make sure the backend is running on port 5000 first. The frontend will not retry; refresh the page after the backend is up.

**`Session expired or invalid` after login.** Your `JWT_SECRET` value changed since the token was issued. Log out and back in to receive a new token signed with the current secret.

**CORS errors in the browser console.** The backend currently only accepts requests from `http://localhost:5173`. If you run the frontend on a different port, update the `origin` value in `CampusNest/server.js`.

## Author

**A. Nivetha**
Student ID 2022ICT112
2nd-year IT, University of Vavuniya
Module: IT2234 — Web Services & Technology
Submission: ICA-03
