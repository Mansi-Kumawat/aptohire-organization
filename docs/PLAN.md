# Organization portal plan

## Routes
Public: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`. Portal: `/` (Jobs), `/jobs/new`, `/jobs/:jobId`, `/jobs/:jobId/edit`, `/candidates`, `/candidates/:candidateRef`, `/requests`, `/requests/:requestId`, `/pipeline`, `/directory`, `/notifications`, `/account`, `/help`, and a not-found route.

## Feature modules
Auth and organization gates; jobs and JD reader; blind candidate matching; consent requests and scoped reveal; pipeline and feedback; public directory; notifications; account and support. UI is separated from data adapters.

## Backend interface
`Backend` is grouped into `auth`, `organization`, `jobs`, `skills`, `matching`, `candidates`, `requests`, `reveal`, `pipeline`, `feedback`, `directory`, `notifications`, `config`, and `account`. Components use this boundary; the mock implementation runs without network. The Supabase adapter is an explicit contract placeholder pending `docs/CONTRACT.md`.

## Mocking
Fictional recruiter, job, and anonymized candidate fixtures are deterministic. Candidate identity is not included in list fixtures. Reveal, Supabase contract mappings, auth lifecycle, notifications, and advanced demo simulations are placeholders and must be completed against the backend contract before production.
