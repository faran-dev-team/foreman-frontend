# Foreman Frontend

Next.js 14 owner dashboard for Foreman — calls, jobs, settings, and revenue captured.

## Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Clerk** (authentication)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Clerk

1. Create a free app at [clerk.com](https://clerk.com).
2. Copy `.env.example` to `.env` (or `.env.local`).
3. Paste your **Publishable key** and **Secret key** from the Clerk dashboard.

### 3. Configure backend API

Add to `.env` (or `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_SHOP_ID=<shop-uuid-from-backend>
```

The backend must be running with CORS allowing `http://localhost:3000`. In development, the resolved API URL is logged to the browser console as `[Foreman API] NEXT_PUBLIC_API_URL → …`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/calls` or `/sign-in` |
| `/sign-in` | Public | Clerk sign-in |
| `/sign-up` | Public | Clerk sign-up |
| `/calls` | Protected | Calls table (time, caller, intent, outcome, est. value) |
| `/jobs` | Protected | Revenue Captured card + jobs table |
| `/settings` | Protected | Google Calendar connect + shop config forms |

## Scripts

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

## Verification checklist

1. Start [foreman-backend](https://github.com/faran-dev-team/foreman-backend) on port 8000.
2. Run `npm run dev` and open http://localhost:3000.
3. Sign in via Clerk — protected routes (`/calls`, `/jobs`, `/settings`) should load.
4. Confirm API calls succeed (no CORS or network errors in DevTools).
5. `GET http://localhost:8000/health` returns `"status": "ok"`.
