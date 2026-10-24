# AptoHire Organization Portal: Integration & Production Guide

**Audience:** Use this as the hand-off/runbook for your IDE AI tool (Cursor, Claude Code, Copilot, etc.). The other AptoHire portals have already been created. Do not regenerate them or merge their source into this repository.

**Source of truth:** Follow the attached `MASTER-RUNBOOK.md` for the multi-portal architecture and operational rules. If this file and the Runbook conflict, stop and ask the owner to resolve it; do not guess or silently weaken security. This guide is specific to the current organization portal repository.

**Current status:** This portal is a working UI prototype with deterministic, anonymized mock data. It is not production-ready and must only use fictional demo data until all security and end-to-end checks below pass.

---

## 1. What is already here, and what remains

### Organization portal already has

- Independent React/TypeScript/Vite application, with its own routes, UI, tests and mock backend.
- Mock experience for jobs, candidate matching, requests, pipeline, directory, notifications and account/help screens.
- Candidate-list fixtures use aliases and omit identity. The consent-aware request/shared-information UI is a prototype; treat mock information as fictional and ephemeral.
- An adapter boundary at `frontend/src/lib/backend/` and `.env.example` with local portal URLs and Supabase variables.
- A placeholder `frontend/src/lib/backend/supabase/index.ts` and basic `Backend` types.
- Product/security references under `docs/`.

### Not complete / production blockers

1. **Real Supabase adapter:** currently throws “Supabase contract not configured.” It is not connected to real database operations.
2. **Authoritative backend contract:** `docs/CONTRACT.md` is not present in this repository. Do not invent table/view/function names. Obtain it from the separate backend project's contract export.
3. **Auth lifecycle and authorization:** real sign-in, session restoration/expiry, sign-out, organization-role checks, approved-organization/subscription gates and auth callbacks need implementation and tests.
4. **All real data methods:** jobs, blind matching, requests, consent-scoped reveal, pipeline, feedback, directory, notifications and account methods must be mapped to the actual contract. Current `Backend` interface only covers a subset, so reconcile it with UI use cases and the backend contract before coding.
5. **Privacy/security proof:** server-side RLS and function authorization, blind candidate views, consent scope/expiry checks, non-disclosure of identity in pre-consent responses, and negative tests are not proven for this portal yet.
6. **Real multi-portal flow:** mock mode is isolated per portal and cannot prove that actions in one portal appear in another. A shared backend and end-to-end tests are required.
7. **Production operations:** migrations, secrets, logging/monitoring, error handling, rate limits, backups, domain/auth URL configuration and deployment smoke tests must be completed.
8. **E2E coverage:** unit tests currently pass, but the Master Runbook's full E2E/demo/privacy checks remain required. Do not interpret a successful build as production readiness.

**Important distinction:** All five websites are separate applications and repositories/projects; the shared backend is the integration point. Do not import another portal's source code, access its local storage, or expose one portal's private client state to another. Cross-portal navigation is ordinary links using configured site URLs. Authentication is separate per site according to the Master Runbook; do not promise cross-site SSO unless the owner separately specifies and security-designs it.

---

## 2. Instructions for the IDE AI tool

Open the **organization portal repository** as the working project. Make the other portal repositories and the attached Master Runbook available as read-only references if the IDE supports that. The backend repository is separate and should be included as a reference when available.

Paste this instruction before implementation:

> Read `MASTER-RUNBOOK.md`, `docs/IDE-AI-INTEGRATION-PRODUCTION-GUIDE.md`, `README.md`, and all files in `docs/` before changing code. This organization portal is one independent app among five already-created AptoHire portals. Do not rebuild the other portals, copy their source into this repo, redesign sign-in/sign-up screens, or change the existing privacy/product decisions. Do not invent backend tables, views, RPCs, fields or authorization rules. Use only the authoritative backend `docs/CONTRACT.md` after it is exported from the backend project. Never use a service-role key in browser code, Vite env vars, commits, logs or screenshots. Preserve mock mode and ensure it works without network. Use fictional data only. Work phase-by-phase below; first inspect and report, then wait for approval before each implementation phase. Never execute a remote database push, function deployment, secret-setting command, or production deployment. The owner does those operations manually.

### Phase 0 — inventory only (no edits)

Ask the IDE AI to:

1. Inspect the organization repo, the attached Master Runbook, the backend repo if available, and the other four portal repos as read-only references.
2. Produce `docs/INTEGRATION-INVENTORY.md` listing for each portal: repository/folder, local port, hostname, user role, routes/features, configured site URL env var, auth redirect needs, and backend operations it needs. Mark unknowns as **TODO—owner confirmation**, not guesses.
3. Compare the five apps' required workflows to the backend's current migrations, RLS policies, functions and `CONTRACT.md` (if already exported). Mark each as Present / Partial / Missing and cite actual paths or contract names.
4. Audit this organization portal's adapter methods, all UI call sites, auth/role guards, privacy-sensitive candidate/request/reveal routes, tests, and env handling. Identify mismatches without changing code.
5. Return a prioritized gap list, tests to add, risks, and proposed small commits. Stop and wait for the owner's approval.

Do not ask the AI to “make it production ready” in one shot. Follow phases and review each diff.

---

## 3. Phased implementation workflow

### Phase 1 — establish the backend contract first

The Master Runbook says the separate backend project is the source of truth. If the backend work is unfinished, complete/verify it there first; do not make up organization-side schema.

1. In the backend project, follow the Master Runbook's backend delta process and finish remaining backend phases. Review its audit before implementation.
2. Run the backend's local checks from the backend directory as specified in the Runbook: database reset/tests, function tests/checks and contract export. Never edit an already-applied migration; add a new migration instead.
3. Export `contract-dist/CONTRACT.md` from the backend and copy the authoritative contract into `aptohire-organization/docs/CONTRACT.md` and the docs of each other portal. Keep each copy synchronized whenever the contract changes.
4. Confirm the contract explicitly covers the organization portal's authorized operations, including tenant scoping, anonymous candidate matching, consent request creation/status, consent-scoped reveal, expiry/revocation, jobs, pipeline and notifications as applicable.
5. Require the backend AI to report the exact contract names and the security/RLS/function tests supporting each operation. If a needed operation is missing, implement it in the backend under its own review; do not work around it in the browser.

**Gate:** Do not switch this portal to `VITE_USE_MOCKS=false` until the contract exists, has been reviewed by the owner, and backend security tests pass locally.

### Phase 2 — complete this portal's data boundary

1. Map every screen action and query to the contract. Expand `frontend/src/lib/backend/types.ts` and the `Backend` interface only as needed, preserving a UI-independent contract.
2. Implement real calls only in `frontend/src/lib/backend/supabase/`. Keep components consuming the adapter, not importing Supabase directly.
3. Use the authenticated recruiter session and public anon key. Let RLS and authorized server functions enforce access. Never query identity tables directly.
4. Candidate search/list/detail before explicit student consent must use only the backend-approved blind view/function and return aliases, scores/verified skill evidence and other explicitly approved non-identifying fields. Never include student name, email, photo, contact information, university, identity UUID or a reversible identity reference in the pre-consent payload, browser URL, document title, analytics, logs or persistent browser storage.
5. Reveal only via the approved audited backend function after it independently confirms the authenticated organization, accepted consent, requested scope, non-expired grant and non-revoked status. The function must return only the allowed fields. The browser is not the security boundary.
6. Keep revealed data in short-lived in-memory state only; clear it on sign-out, navigation away, expiry/revocation and session change. Do not put revealed identity in URLs, local/session storage, query caches that persist, logs or error-reporting payloads.
7. Handle loading, empty, permission-denied, expired-consent, network, validation and retry states without leaking private backend errors. Do not hide authorization failures by falling back to mock data.
8. Keep `VITE_USE_MOCKS=true` as the safe default. Selecting real mode must never silently downgrade to mock mode when backend configuration is missing.

### Phase 3 — auth and organization gates

1. Follow the backend contract for Supabase Auth and role/organization membership. Implement session restoration, auth-state changes, sign-out and safe callback handling.
2. Enforce role on the server/database as well as in route guards. A UI route guard is usability, not authorization.
3. Require approved organization status and active subscription wherever the contract/business rules require it; enforce those checks in backend policies/functions too.
4. Keep the existing sign-in/sign-up visual design unchanged. Wire behavior and validation without redesigning those pages unless the owner explicitly requests it.
5. Configure auth redirect URLs for local organization origin `http://localhost:5176/**` and deployed `https://organization.aptohire.com/**`; use the exact URL/redirect model from the Master Runbook and Supabase settings.
6. Test wrong-role sign-in, pending/rejected organization, inactive subscription, expired session, sign-out and direct navigation to protected routes.

### Phase 4 — connect the already-created portals

1. **Do not connect portals by importing source code or sharing browser storage.** Connect them by the shared Supabase backend using the same version of `CONTRACT.md`.
2. Confirm the other four applications' own environment files point at the same local Supabase API and public anon key in local real mode. Never copy a service-role key to any portal.
3. Configure each portal's URLs using its own `.env.example`/Master Runbook values:
   - Root: `http://localhost:5173` → production `https://aptohire.com`
   - Student: `http://localhost:5174` → production `https://student.aptohire.com`
   - University: `http://localhost:5175` → production `https://university.aptohire.com`
   - Organization: `http://localhost:5176` → production `https://organization.aptohire.com`
   - Admin: `http://localhost:5177` → production `https://admin.aptohire.com`
4. Use ordinary absolute links from each app for actions such as “Go to your portal,” help/support and the public credential-verification flow. Use the URL environment variables (`VITE_ROOT_URL`, `VITE_STUDENT_URL`, `VITE_UNIVERSITY_URL`, etc.); do not hard-code production/local hostnames in components. Never put candidate identity or consent details into a cross-portal URL.
5. Keep separate sign-ins as specified in the Master Runbook. If a cross-portal journey needs a user to switch sites, provide a clear link and let the user authenticate at the destination. Do not assume a session on one origin authenticates another.
6. Align each portal to contract changes by copying the new contract and regenerating client types as provided by the backend. Review generated diffs; do not manually invent generated database types.
7. Build and run all portals in mock mode first to confirm each still works independently. Then start the local backend and all portals and test the shared-backend journey with the Runbook's fictional demo accounts.

### Phase 5 — tests and privacy verification

Add tests before enabling real mode. Minimum organization-portal coverage:

- Unit tests for adapter mapping and error handling (mock Supabase responses; never hit production in tests).
- Auth/role tests for organization, student, university and unauthenticated sessions.
- RLS/function integration tests in the backend proving organization A cannot access organization B's jobs/candidates/requests.
- Blind-list tests proving identity fields are absent in database responses and rendered DOM before consent.
- Consent tests: pending consent cannot reveal; accepted scope allows only that scope; out-of-scope fields remain absent; expiry and revocation immediately deny reveal.
- URL/storage/log audit for names, email, photo, university, candidate UUID/ref or revealed fields.
- Request tests for creation, duplicate/invalid requests, cancellation/decline and backend errors, according to contract behavior.
- UI tests for expired consent, network error, loading and empty state.
- E2E test across Student → Organization: recruiter requests access, student reviews/accepts scoped request, recruiter sees only approved scope, then expiry/revocation hides it.
- Cross-tenant E2E test: one organization cannot infer or access another organization's private data.

For every portal run:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Also run the backend checks and complete all manual smoke/privacy checks in the attached Master Runbook (including 375px viewport, keyboard focus, reduced motion, wrong-role behavior, and the complete end-to-end demo twice after reset). Set up and run `npm run e2e` where the repository's Playwright setup exists; report any missing E2E setup as a blocker rather than claiming it passed.

### Phase 6 — local shared-backend integration

Follow the Master Runbook exactly. In brief:

1. Start Docker and the backend's local Supabase (`npm run db:start`), reset/test it, and serve its functions. Use `AGENT_MODE=mock` for the demo unless the owner has explicitly approved a separately secured AI integration.
2. Obtain local Supabase URL and anon key from `npx supabase status`. Do not copy or reveal the service-role key.
3. For each portal, copy `.env.example` to `.env.local`. Set `VITE_USE_MOCKS=false`, `VITE_DEMO_MODE=true`, local `VITE_SUPABASE_URL` and the **anon** key, plus that portal's sibling URLs. Keep secrets in ignored local files and restart dev servers after edits.
4. Run all portals on their assigned ports and follow the Master Runbook's 8-step end-to-end demo. Use only fictional accounts and records.
5. Run cross-tenant, consent-scope, expiry, revocation and wrong-role tests. Fix backend security failures at the backend, never by making a frontend check authoritative.
6. Re-test mock mode offline by setting `VITE_USE_MOCKS=true` and disabling network. No page should require Supabase merely to run in mock mode.

### Phase 7 — production readiness and deployment (owner-operated)

Only start after the owner approves the security review and Definition of Done. The owner—not the IDE AI—creates/owns production resources and runs remote commands.

1. Decide if this is still a fictional demo or a real service. For real people/student data, obtain privacy/legal review, define retention/deletion, incident response, support, data processing terms, and required regional/privacy compliance before launch.
2. Create a separate Supabase production project; use production-grade backups, monitoring, restricted database access and reviewed migrations/RLS. Do not seed demo data into production.
3. Create separate dev/staging/production environments and keys. Keep secrets in the hosting provider/backend secret store. `VITE_*` values are public build-time values; never put passwords, peppers, JWT secrets, service-role keys or private API keys in them.
4. Owner configures Supabase Auth site URL, exact redirect allowlist for all five production hostnames, email provider/confirmation, password policy and MFA as required. Configure allowed origins/CORS narrowly.
5. Owner applies reviewed migrations and deploys reviewed functions to the intended Supabase project. Follow the Master Runbook's production-secret and deployment safeguards. Do not run `db push`, `functions deploy`, `secrets set`, destructive resets or production migrations from an AI agent.
6. Create five separate hosting projects (one per portal/repo), configure the correct build command/root directory and public env variables per environment, attach domains/DNS, and use HTTPS. Keep admin access protected and do not advertise its URL.
7. Configure security headers/CSP, rate limits/abuse protection, logging with PII redaction, monitoring/alerts, backup/restore tests, incident/contact process and dependency update/audit process. Keep candidate identity and tokens out of logs and analytics.
8. Deploy staging first. Test each portal's direct routes/refreshes, auth redirect/logout, backend connectivity, consent/reveal/expiry, cross-tenant boundaries, email flows, mobile layout, keyboard navigation and error handling.
9. Run the full end-to-end demo twice on staging after reset. Verify no demo credentials/seed data are present in production. Owner signs off before promoting to production.
10. After release, monitor errors, access denials, unusual request volume and function latency; test restore and incident procedures regularly. Revoke/rotate credentials immediately if exposed.

---

## 4. Definition of done for this portal

Do not call the organization portal production-ready until all are true:

- [ ] Backend `CONTRACT.md` exists, is authoritative and is copied into this repo; operation names match the implementation.
- [ ] Real adapter is complete; mock mode still runs without network; missing real configuration fails clearly and never silently falls back to mock.
- [ ] Auth/session/role, organization approval and subscription gates are enforced by backend policies/functions and UI routes.
- [ ] Candidate matching uses blind authorized data only; scoped reveal is performed by an audited backend function and is time-limited/revocable.
- [ ] No unauthorized identity data reaches browser, URL, storage, logs, analytics, errors or pre-consent DOM.
- [ ] Backend RLS/function tests, portal unit tests, cross-portal E2E tests and privacy checks pass.
- [ ] All five separate apps work with the same backend contract; the Master Runbook end-to-end demo succeeds twice.
- [ ] `typecheck`, `lint`, `test`, `build`, E2E, responsive/accessibility and security checks pass for every portal.
- [ ] Staging deployment, production environment variables, redirects, domains, backups, monitoring and rollback plan are reviewed.
- [ ] Owner has personally approved production resource changes and privacy/legal readiness.

## 5. Change-management rules for the IDE AI

- Work in small phases and show a concise report with files changed, tests run, tests not run, risks and next TODOs.
- Commit only after owner review; do not overwrite the other portals or the Master Runbook.
- Never edit an applied migration; add a new migration through the backend project.
- Never weaken RLS, consent checks, MFA or role checks to make a UI flow pass.
- Never use real candidate data in mock fixtures, screenshots, tests or AI prompts.
- Never write credentials into this guide, source, screenshots, issues or logs.
- If the contract is missing/ambiguous, stop and report the exact question/blocker. Do not guess.
