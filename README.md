# Court Case Portal (CCP)

A bilingual (English/Arabic) case management web app built with the MERN stack. Clerks and Admins can register, track, and update court cases through their full lifecycle, with role-based access control and a dashboard overview of case statuses.

## Live Demo

- **App:** https://court-case-portal.vercel.app
- **API:** https://court-case-portal.onrender.com

There's no public sign-up — log in with one of the seeded demo accounts:

| Role  | Employee ID | Password   |
|-------|-------------|------------|
| Admin | 100001      | Demo1234   |
| Clerk | 100002      | Demo1234   |

Admin can additionally access **Manage Users**. Both demo accounts are protected from deletion, and admins can't delete themselves or the last remaining admin.

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after a while may take 30-60 seconds to respond while it wakes back up.

## Features

- JWT-based authentication with role-based access (Admin / Clerk)
- Case lifecycle tracking: Registered → In Hearing → Judgment → Closed, with enforced valid status transitions
- Case creation/editing with multiple parties (Plaintiff, Defendant, Witness) and validation
- Search, filter (status, judge, date range), and pagination on the case list
- A stats dashboard summarizing case counts by status
- Admin-only user management (create/list/delete accounts)
- Full English/Arabic bilingual UI with automatic RTL layout switching
- Responsive design, including a dedicated mobile navigation and filter experience

## Tech Stack

**Frontend** (`frontend/`)
- React 19 + Vite
- Tailwind CSS 4
- React Router 7
- react-i18next (English/Arabic, RTL-aware)
- react-icons (Heroicons outline set)
- Axios

**Backend** (`backend/`)
- Node.js (ESM) + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for auth, `bcryptjs` for password hashing
- `express-rate-limit` on the login endpoint

## Project Structure

```
CCP/
├── backend/          # Express + MongoDB API
├── frontend/         # React + Vite client
└── docker-compose.yml
```

## Running Locally

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URL=<your MongoDB connection string>
JWT_SECERT=<a long random string>
```

```bash
npm run dev        # starts the API on http://localhost:5000
```

To seed the two demo accounts into your database:

```bash
npm run seed
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # starts the app on http://localhost:5173
```

By default the frontend talks to `http://localhost:5000/api/CasePortal`. To point it elsewhere, set `VITE_API_URL` in a `frontend/.env.local` file.

### Using Docker instead

```bash
docker-compose up
```
Spins up the backend, frontend, and a local MongoDB instance together.

## API Overview

All routes are prefixed with `/api/CasePortal`.

| Method | Endpoint                     | Access        | Description                  |
|--------|-------------------------------|---------------|-------------------------------|
| POST   | `/auth/login`                 | Public        | Log in, returns a JWT         |
| GET    | `/cases/getCases`              | Authenticated | List/search/filter cases (paginated) |
| POST   | `/cases/createCase`            | Authenticated | Create a case                 |
| GET    | `/cases/getCase/:caseNum`      | Authenticated | Get one case                  |
| PUT    | `/cases/updateCase/:caseNum`   | Authenticated | Update a case / change status |
| DELETE | `/cases/deleteCase/:caseNum`   | Authenticated | Delete a case                 |
| GET    | `/cases/stats`                 | Authenticated | Case counts by status         |
| GET    | `/user/getUsers`               | Admin only    | List users                    |
| POST   | `/user/createAccount`          | Admin only    | Create a user                 |
| DELETE | `/user/deleteAccount/:employeeId` | Admin only | Delete a user                 |

## Roles

- **Clerk** — can manage cases (create, view, edit, update status, delete).
- **Admin** — everything a Clerk can do, plus creating, listing, and deleting user accounts.

## Deployment

- **Backend** deployed on Render as a Node web service. Requires `MONGO_URL`, `JWT_SECERT`, and `FRONTEND_URL` (the deployed frontend's URL, used for CORS) as environment variables.
- **Frontend** deployed on Vercel, root directory set to `frontend/`. Requires `VITE_API_URL` pointing at the deployed backend, and a `vercel.json` rewrite rule so client-side routing works on page refresh.
