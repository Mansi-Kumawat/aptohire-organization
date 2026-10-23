# AptoHire Organization portal

This repository is the independent recruiter-facing portal. It does not import code from the other AptoHire portals. All portals connect to one shared Supabase database; this app never needs a service-role key and never reads identity tables. Recruiters see blind candidate cards from backend views. A student's name and other permitted information can be shown only after the student grants scoped, time-limited access.

## Folder layout
- `frontend/` — React + TypeScript application, UI, routes, and client-side adapters.
- `backend/` — backend integration notes and contract boundary; database migrations and secrets belong to the separate `aptohire-backend` project, not here.
- `docs/` — plan and supplied product references.

## Run locally
1. Install Node.js LTS and Git.
2. Run `npm install` from this folder.
3. Copy `.env.example` to `.env.local`.
4. Keep `VITE_USE_MOCKS=true` and run `npm run dev`.
5. Open `http://localhost:5176`. Use any non-empty password with a demo account.

## Demo accounts
`recruiter@orga.demo.test`, `recruiter@orgb.demo.test`, `recruiter@orgc.demo.test`, `recruiter@orgd.demo.test`. The portal currently supplies anonymized sample matching data. Mock demo controls shown in Account are prototype affordances and are not a production access workflow.

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

To connect Supabase, set its URL and public anon key, set `VITE_USE_MOCKS=false`, then copy the authoritative `docs/CONTRACT.md` from `aptohire-backend`. Authentication redirect URLs should include `https://organization.aptohire.com/**` and `http://localhost:5176/**`. The `supabase/` adapter must then be implemented against that contract. The other four portals are separately deployed applications. Deploy this as its own Vercel project on `organization.aptohire.com`. Vercel Hobby is intended for non-commercial demos.

## Important limitations
This implementation remains a runnable UI prototype. It now includes the contact-checked access-request dialog and mock organization states for pending approval and inactive subscription. The real Supabase adapter, complete Auth and role gates, consent-based reveal, all privacy tests, complete demo tools, and production security policies are not complete. Do not set this app to production or use it for real candidate data. Never add the service-role key.
