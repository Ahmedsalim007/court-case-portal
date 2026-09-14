# Court Case Portal (CCP)

A full-stack web application for managing court cases, built as a monorepo with a React frontend and an Express/MongoDB backend.

## Project Structure

```
CCP/
├── frontend/          # React + Vite client
└── my-api/            # Express + MongoDB API
```

Root-level `package.json` only carries dev tooling deps shared between packages (dotenv, express, jsonwebtoken, nodemon, @playwright/test). Each subfolder is its own npm package with its own `node_modules`.

## Tech Stack

### Frontend (`frontend/`)
- **React 19** + **Vite 8** + **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **React Router 7** for routing
- **Axios** for HTTP (`src/api/axiosIntance.js` — note the typo in the filename)
- **i18next** + **react-i18next** for i18n (English/Arabic, with RTL auto-direction in `src/i18n.js`)
- **jwt-decode** for client-side token parsing
- **lucide-react** for icons
- **ESLint** flat config (`frontend/eslint.config.js`)
- Dev/test: **@playwright/test**

### Backend (`my-api/`)
- **Node.js** ESM (`"type": "module"`)
- **Express 5**
- **MongoDB** via **Mongoose 9**
- **JWT** (`jsonwebtoken`) for auth, **bcryptjs** for password hashing
- **express-rate-limit** on auth endpoints
- **cors** (allowed origin: `http://localhost:5173`)
- **dotenv** for env config (see `my-api/example.env`)

## Running the Project

Two terminals required:

```bash
# Terminal 1 — backend
cd my-api
cp example.env .env       # fill in MONGO_URL and JWT_SECERT
npm install
npm run dev               # nodemon app.js, listens on PORT (default 5000)

# Terminal 2 — frontend
cd frontend
npm install
npm run dev               # vite, default port 5173
```

Available scripts:
- Backend: `npm run dev` (nodemon), `npm start` (node)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

API base URL: `http://localhost:5000/api/CasePortal`
Frontend talks to backend with Bearer auth via the shared axios instance.

## Domain Model

### Case (`my-api/models/case.js`)
- `caseNum`: auto-generated string `CASE-YYYY-NNNN` (yearly counter via `Counter` model in `utils/generateCaseNum.js`)
- `parties`: array of `{ name, role }` where `role ∈ {Plaintiff, Defendant, Witness}`. Must include at least one Plaintiff and one Defendant.
- `hearingDate`: future date only; **locked** once status moves past `Registered` (enforced both in schema and `utils/caseValidators.js`).
- `assignedJudge`: free-text name (letters only, supports Arabic via Unicode range `\u0600-\u06FF`).
- `status`: enum, default `Registered`
- `createdBy` / `updatedBy`: references to `User`

### Status Workflow (`my-api/utils/validTransitions.js`)
```
Registered → In Hearing → Judgment → Closed → (terminal)
```
Enforced in controller `UpdateCase` and via a `pre('save')` hook on the `Case` schema. Frontend mirrors this in `frontend/src/constants/caseConstants.js`.

### User (`my-api/models/user.js`)
- `fullName`: letters only
- `employeeId`: 1–6 digits, unique
- `password`: min 6 chars, bcrypt-hashed in `pre('save')`
- `role`: enum, default `Clerk` (only role defined today)

## API Endpoints

Mounted under `/api/CasePortal` in `my-api/app.js`:

### Auth (`routes/auth.route.js`) — rate-limited via `authLimiter` (15-min window, max 8)
- `POST /auth/register` — `{ fullName, employeeId, password }` → returns JWT
- `POST /auth/login` — `{ employeeId, password }` → returns JWT

### Cases (`routes/case.route.js`) — all require Bearer JWT (`requireAuth`)
- `POST /cases/createCase` — `{ caseParties, caseHearingDate, caseAssignedJudge }`
- `GET /cases/getCases` — query params: `status, judge, search, fromDate, toDate, page, limit`. Runs `filterCases` then `paginate` middlewares.
- `GET /cases/getCase/:caseNum`
- `PUT /cases/updateCase/:caseNum` — partial update; status changes validated against `validTransitions`
- `DELETE /cases/deleteCase/:caseNum`
- `GET /cases/stats` — aggregation of case counts by status

### Middleware (`my-api/middlewares/`)
- `auth.middleware.js` — JWT verification, attaches `req.user`
- `filterCases.middleware.js` — builds Mongo `req.filter` from query params
- `paginate.middleware.js` — builds `req.pagination = { pageNum, limitNum, skip }`
- `rateLimiter.middleware.js` — `authLimiter`
- `errorHandler.middleware.js` — central error handler, handles `ValidationError`, `CastError`, and duplicate-key (`code 11000`)

## Frontend Structure (`frontend/src/`)

- `pages/`: `LoginPage`, `RegisterPage`, `CaseListPage`, `CaseDetailPage`, `CaseCreatePage`, `CaseUpdatePage`
- `components/`: `Navbar`, `ProtectedRoute`, `CaseCard`, `CaseFilters`, `CaseStatsPanel`, `PartyFieldsEditor`, `StatusBadge`, `StatusTracker`
- `api/`: `axiosIntance.js` (note typo), `authApi.js`, `caseApi.js`, `caseStatsApi.js`
- `context/AuthContext.jsx` — token + decoded user, persisted in `localStorage`
- `hooks/`: `useDebounce`, `usePartyFields`
- `utils/validateCaseForm.js` — client-side form validation mirroring backend rules
- `constants/caseConstants.js` — `STATUS_ORDER`, `PARTY_ROLES`, `VALID_TRANSITIONS`
- `locales/en.json`, `locales/ar.json`

### Routing in `App.jsx`
- `/login`, `/register` — public
- `/`, `/cases/*` — wrapped in `ProtectedRoute` (checks `AuthContext.isAuthenticated`)
- `/` redirects to `/login`

### Auth flow
- Token stored in `localStorage` under key `token`
- Axios interceptor injects `Authorization: Bearer <token>` for non-auth requests
- On 401 (with prior auth header), clears token and redirects to `/login?sessionExpired=true`

## Known Quirks / Things to Be Aware Of

- **Typo**: `JWT_SECERT` (should be `JWT_SECRET`) is used consistently throughout the codebase — do not "fix" without renaming everywhere (`app.js`, controllers, middleware).
- **Filename typo**: `frontend/src/api/axiosIntance.js` (should be `axiosInstance.js`). Multiple components import this exact path.
- Backend uses ESM throughout; new files must use `import`/`export`.
- The `Case` `pre('save')` hook uses `$locals.previousStatus` set by the controller to validate transitions even when Mongoose is bypassing schema enum checks.
- No automated tests yet — only `@playwright/test` is installed in both packages; no specs written.
- MongoDB is required; no in-memory fallback.

## Conventions

- Backend responses follow: `{ success: boolean, data?, message, count?, page?, totalPages?, hasNextPage?, hasPrevPage? }`
- Frontend error display reads `err.response?.data?.message` consistently.
- All user-facing strings go through `t()` from `react-i18next`; when adding UI text, update both `en.json` and `ar.json`.
- Form validation is duplicated client-side (`utils/validateCaseForm.js`) and server-side (`utils/caseValidators.js`) — keep them in sync.