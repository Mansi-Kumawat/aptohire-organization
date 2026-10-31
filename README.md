# AptoHire Organization portal

Independent recruiter-facing portal. The browser uses the public Supabase anon key and the signed-in user's session only; it must never use a service-role key or query protected student identity/evidence tables. Candidate cards are blind by default. Personal details and evidence are rendered only after scoped, time-limited consent.

## Folder layout
- `frontend/` — React + TypeScript application, routes, UI, mock and Supabase adapters.
- `backend/` — integration notes; migrations, functions, and secrets belong to the separate `aptohire-backend` project.
- `docs/` — portal contract and audit notes.

## Run locally (mock)
1. Install Node.js LTS and Git.
2. From this folder run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Keep `VITE_USE_MOCKS=true` and run `npm run dev`.
5. Open `http://localhost:5176`. The labelled demo accounts are `recruiter@orga.demo.test`, `recruiter@orgb.demo.test`, `recruiter@orgc.demo.test`, and `recruiter@orgd.demo.test`; mock sign-in accepts any non-empty password.

Mock actions stay local to the sample workspace and are not real email, request, or hiring workflows.

## Connect a local or approved Supabase environment
Set `VITE_USE_MOCKS=false`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` in the chosen environment. With `VITE_DEMO_MODE=true`, the labelled demo-account shortcuts remain available while authentication and portal requests use the real Supabase backend; their password is supplied through `VITE_DEMO_PASSWORD`. Production validation allows this real-backend demo-login mode but rejects mock data. Use only dedicated demo accounts and a non-privileged demo credential: Vite `VITE_*` values are included in browser code. Never commit `.env.local` or put a service-role key in the frontend. Configure Auth redirect URLs for the actual deployment domains before testing signup and recovery.

The adapter calls the frozen contract's auth, organization, job, matching, access request/reveal, directory, notification, and pipeline surfaces. Review [`docs/CONTRACT.md`](./docs/CONTRACT.md) and [`docs/FROZEN-CONTRACTS.md`](./docs/FROZEN-CONTRACTS.md) alongside the backend's current contracts. `VITE_DEMO_MODE=true` shows account shortcuts; it does not seed database rows. Use the fictional Organization accounts after the backend demo seed has been applied to the dedicated demo project. A newly signed-up organization user is linked to an organization only when a matching verified-email application is claimed; a standalone Auth row does not inherit seeded demo jobs. Local type/lint/test/build passing does **not** establish live Supabase or hosted-project parity.

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Run on port 5176 |
| `npm run typecheck` | Strict TypeScript check |
| `npm run lint` | Lint source |
| `npm run test` | Unit tests |
| `npm run build` | Production bundle |
| `npm run e2e` | Playwright (setup required) |
| `npm run db:types` | Generate Supabase types using project ref |

## Known integration limitations
- Live Auth, RLS, Edge Function, realtime, and signed-storage behavior have not been independently verified against the target Supabase project.
- The backend's `extract-job-skills` response currently exposes skill slugs, levels, weights, and an optional title suggestion; the UI does not assume unsupported `unclear` or `nice_to_have` response fields.
- Feedback submission is not enabled: under the current safe browser/backend contract, the portal cannot submit a student ID, and no approved organization-safe feedback function/policy is available.
- The portal is not certified for production or real candidate data until the owner verifies environment configuration, backend parity, RLS, and authenticated end-to-end flows. Never add a service-role key.
