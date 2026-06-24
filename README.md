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
2. Copy `.env.example` to `.env.local`.
3. Paste your **Publishable key** and **Secret key** from the Clerk dashboard.

### 3. Run the dev server

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
| `/calls` | Protected | Calls list (placeholder) |
| `/jobs` | Protected | Jobs & revenue (placeholder) |
| `/settings` | Protected | Shop settings (placeholder) |

## Scripts

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

## Verification checklist

See README verification section after scaffolding — confirm login, protected routes, and all three dashboard pages load.
