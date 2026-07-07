# Supabase Team Flow

> A starter project combining a Vite + React client with Supabase Edge Functions and database migrations for team/product flows.

## Overview

This repository contains a React client (in `client/`) and Supabase Edge Functions + migrations (in `supabase/`) used to manage teams, members, and products.

## Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- Supabase CLI (for local function development and migrations)

## Quick start

1. Install dependencies for the client:

```bash
cd client
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. (Optional) Run Supabase functions locally (requires Supabase CLI and credentials):

```bash
# from repo root
cd supabase
supabase start           # starts local DB and environment
supabase functions serve # run edge functions locally
```

## Environment variables

Create a `.env` (or use your preferred env mechanism) for the client and Supabase local environment. Common variables:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key for the client
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server functions, keep secret)

Check `client/README.md` (if present) or `client/package.json` scripts for additional env needs.

## Database migrations

SQL migrations live in `supabase/migrations/`. Apply them using your Supabase workflow or via the Supabase CLI connected to your project.

## Project structure

- `client/` — Vite + React app, UI components, hooks, services, and pages.
- `supabase/` — Supabase Edge Functions, shared server utilities, and SQL migrations.

Key client folders:

- `client/src/components/` — UI components and custom components
- `client/src/services/` — API, auth, product, storage, and team services
- `client/src/lib/` — Supabase client wrapper and utilities

## Tests & linting

See `client/package.json` for available scripts such as linting, formatting, and tests.

## Deploy

- Client: deploy with Vercel (there is a `client/vercel.json`). Configure environment variables in your Vercel project.
- Supabase: deploy functions and apply migrations using Supabase platform or CLI.

## Contributing

Contributions are welcome. Open issues or pull requests with clear descriptions. Follow existing code style and run linters/tests before submitting.

## License

This project does not include a license file. Add a `LICENSE` if you plan to open-source the project.

---
