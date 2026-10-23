\# Supabase-First Application Security Audit and Hardening Prompt

\#\# Purpose

Perform a comprehensive security audit of this application, with special attention to Supabase Database, Auth, Storage, Realtime, Edge Functions, database functions, API exposure, secrets, authorization, privacy, business logic, and production deployment.

This is not a superficial checklist.

You must inspect the actual repository, configuration files, migrations, SQL policies, server routes, frontend code, dependencies, generated clients, deployment configuration, and tests. Do not mark something as secure merely because a security feature exists. Verify that it is correctly configured and tested.

\---

\# Project Context

Before beginning, infer as much as possible from the repository and complete this section.

\- \*\*Application name:\*\* \`\[APP\_NAME\]\`  
\- \*\*Application type:\*\* \`\[SaaS / marketplace / internal tool / AI application / e-commerce / other\]\`  
\- \*\*Frontend framework:\*\* \`\[Next.js / React / Vue / Svelte / other\]\`  
\- \*\*Backend architecture:\*\* \`\[Supabase Edge Functions / Next.js API routes / separate server / direct Data API\]\`  
\- \*\*Deployment platform:\*\* \`\[Vercel / Cloudflare / Netlify / other\]\`  
\- \*\*Supabase usage:\*\*  
  \- Database: \`\[yes/no\]\`  
  \- Auth: \`\[yes/no\]\`  
  \- Storage: \`\[yes/no\]\`  
  \- Realtime: \`\[yes/no\]\`  
  \- Edge Functions: \`\[yes/no\]\`  
  \- Database Functions/RPC: \`\[yes/no\]\`  
  \- Cron/Queues/Webhooks: \`\[yes/no\]\`  
  \- Vector database/pgvector: \`\[yes/no\]\`  
\- \*\*Authentication methods:\*\* \`\[email-password / magic link / OTP / OAuth / phone / SSO\]\`  
\- \*\*Authorization model:\*\* \`\[single-user / organizations / workspaces / tenants / roles\]\`  
\- \*\*Roles:\*\* \`\[user / admin / owner / moderator / other\]\`  
\- \*\*Payment provider:\*\* \`\[Stripe / Razorpay / none / other\]\`  
\- \*\*Sensitive information processed:\*\* \`\[PII / financial / health / documents / resumes / messages / other\]\`  
\- \*\*Production domains:\*\* \`\[DOMAINS\]\`  
\- \*\*Allowed development domains:\*\* \`\[DOMAINS\]\`  
\- \*\*Audit mode:\*\* \`\[REPORT\_ONLY / SAFE\_FIX\]\`  
\- \*\*Environment allowed for active tests:\*\* \`\[LOCAL / STAGING / PRODUCTION\_READ\_ONLY\]\`

If information is unavailable, mark it as \`UNKNOWN\`. Do not invent details.

\---

\# Mandatory Safety Rules

1\. Do not perform destructive testing against production.  
2\. Do not delete users, storage objects, database records, migrations, projects, or secrets.  
3\. Do not run denial-of-service, brute-force, flooding, or high-volume tests.  
4\. Do not send repository contents, secrets, customer data, or source code to third-party scanners.  
5\. Do not expose complete secrets in the report.  
6\. Redact secret values using this format:

   \`sb\_secret\_abcd...\[REDACTED\]\`

7\. Do not rotate a live secret automatically. Report it and provide exact rotation instructions.  
8\. Do not apply production migrations automatically.  
9\. Do not weaken security merely to make a failing feature work.  
10\. Never solve an RLS error by disabling RLS.  
11\. Never solve an authorization issue by moving the check only into the frontend.  
12\. Do not assume CORS is an authorization mechanism.  
13\. Do not claim that a test passed unless you actually executed it or proved it from code and configuration.  
14\. Clearly distinguish between:  
    \- Verified  
    \- Inferred  
    \- Not testable  
    \- Manual dashboard verification required  
15\. In \`SAFE\_FIX\` mode:  
    \- Make small, reviewable changes.  
    \- Create database migrations instead of editing production directly.  
    \- Add regression tests before or alongside security fixes.  
    \- Do not introduce breaking schema changes without approval.  
16\. Stop before any action that could:  
    \- Lock users out  
    \- Break production authentication  
    \- Invalidate sessions  
    \- Remove data access  
    \- Rotate credentials  
    \- Alter payment processing  
    \- Change production infrastructure

\---

\# Required Audit Method

Complete the audit in the following order:

1\. Repository and architecture discovery  
2\. Threat model  
3\. Secret exposure audit  
4\. Supabase key and client separation audit  
5\. Database API exposure and grants audit  
6\. Row Level Security audit  
7\. Database functions, triggers, and RPC audit  
8\. Supabase Auth and session audit  
9\. Supabase Storage audit  
10\. Supabase Edge Functions and server API audit  
11\. Supabase Realtime audit  
12\. Payment and business-logic audit  
13\. Input, output, and web-security audit  
14\. Dependencies and supply-chain audit  
15\. Privacy and personal-data-flow audit  
16\. Abuse, rate-limit, and resource-exhaustion audit  
17\. Deployment and infrastructure audit  
18\. Attacker-perspective verification  
19\. Security test creation  
20\. Remediation and final launch decision

Do not skip a section silently. Mark irrelevant sections as \`NOT APPLICABLE\` and explain why.

\---

\# Phase 1 — Repository and Architecture Discovery

Inspect the complete repository.

Identify:

\- Frontend entry points  
\- Server-side entry points  
\- API routes  
\- Middleware or proxy files  
\- Supabase clients  
\- Admin Supabase clients  
\- Edge Functions  
\- Database migrations  
\- Seed files  
\- SQL functions  
\- Triggers  
\- Webhooks  
\- Cron jobs  
\- Storage operations  
\- Realtime subscriptions  
\- Authentication callbacks  
\- Password reset routes  
\- OAuth callbacks  
\- Admin routes  
\- Payment routes  
\- Payment webhooks  
\- File-upload handlers  
\- Analytics integrations  
\- Error-reporting integrations  
\- Email/SMS integrations  
\- AI provider integrations  
\- Environment files  
\- CI/CD workflows  
\- Infrastructure configuration  
\- Tests  
\- Generated database types

Search for duplicated Supabase clients and undocumented server-side clients.

Create an architecture map showing:

\`\`\`text  
Browser  
  ├── Supabase Auth  
  ├── Supabase Data API  
  ├── Supabase Storage  
  ├── Supabase Realtime  
  └── Application server routes  
          ├── User-scoped Supabase client  
          ├── Admin Supabase client  
          ├── Payment provider  
          ├── AI APIs  
          └── Other third parties  
\`\`\`

Adapt the map to the actual application.

\---

\# Phase 2 — Threat Model

Document:

\#\# Assets

Examples:

\- User accounts  
\- Authentication sessions  
\- Customer records  
\- Private files  
\- Organization data  
\- Payment status  
\- Subscription entitlements  
\- Admin capabilities  
\- API keys  
\- AI-generated data  
\- Vector embeddings  
\- Audit logs

\#\# Actors

\- Anonymous visitor  
\- Authenticated user  
\- Malicious authenticated user  
\- Tenant administrator  
\- Application administrator  
\- Compromised browser  
\- Compromised webhook sender  
\- Leaked API-key holder  
\- Third-party integration  
\- Internal developer

\#\# Trust Boundaries

Identify every transition between:

\- Browser and Supabase  
\- Browser and application server  
\- Server and Supabase  
\- Edge Function and Supabase  
\- Supabase and payment provider  
\- Supabase and AI provider  
\- Public schemas and private schemas  
\- User-scoped client and admin client  
\- One tenant and another tenant

\#\# Highest-Risk Scenarios

At minimum, test for:

1\. Cross-user data access  
2\. Cross-tenant data access  
3\. Admin privilege escalation  
4\. Service-role or secret-key exposure  
5\. Unauthenticated RPC execution  
6\. Storage object enumeration  
7\. Unauthorized signed URL generation  
8\. Payment entitlement forgery  
9\. Realtime channel eavesdropping  
10\. Password-reset or OAuth takeover  
11\. Webhook replay  
12\. PII leakage to logs or third parties

\---

\# Phase 3 — Secret and Credential Exposure Audit

Scan the complete repository and Git-aware files for:

\- \`sb\_secret\_\` keys  
\- Legacy Supabase \`service\_role\` keys  
\- Supabase database passwords  
\- PostgreSQL connection strings  
\- JWT signing secrets  
\- OAuth client secrets  
\- SMTP credentials  
\- Stripe or Razorpay secrets  
\- Webhook signing secrets  
\- OpenAI, Anthropic, Gemini, or other AI keys  
\- AWS credentials  
\- Email-provider credentials  
\- Twilio credentials  
\- Private keys  
\- Access tokens  
\- Personal access tokens  
\- Test credentials that work outside local development

Inspect:

\- Source files  
\- \`.env\*\`  
\- Configuration files  
\- Test fixtures  
\- Seed data  
\- Documentation  
\- Comments  
\- Build scripts  
\- CI workflows  
\- Docker files  
\- Deployment configuration  
\- Source maps  
\- Generated frontend bundles  
\- Error logs  
\- Screenshots or sample JSON  
\- Git history, when available

\#\# Required Checks

\- \`.env\` and production environment files must be ignored by Git.  
\- \`.env.example\` may contain names and placeholders only.  
\- Secret values must not appear in client-accessible variables.  
\- Secret values must not use prefixes such as:  
  \- \`NEXT\_PUBLIC\_\`  
  \- \`VITE\_\`  
  \- \`REACT\_APP\_\`  
  \- \`PUBLIC\_\`  
  \- Framework-specific public prefixes  
\- Secret values must not be embedded into static frontend bundles.  
\- Logs and exception responses must not reveal credentials.  
\- CI artifacts must not contain environment dumps.  
\- Deployment previews must not receive unnecessary production secrets.  
\- Documentation must not contain active credentials.

\#\# Supabase Key Classification

Treat these as browser-safe only when database authorization is correctly enforced:

\- Supabase publishable keys  
\- Legacy Supabase anon keys

Treat these as server-only privileged secrets:

\- Supabase secret keys  
\- Legacy Supabase service-role keys  
\- Direct database credentials  
\- JWT signing keys  
\- Management API tokens

A publishable or anon key is not a substitute for RLS.

A secret or service-role key bypasses normal user-level database authorization and must never appear in:

\- Browser code  
\- Mobile application bundles without a trusted server  
\- Public repositories  
\- Public environment variables  
\- Client-accessible API responses  
\- Logs  
\- Analytics events  
\- Error-reporting breadcrumbs

\#\# Required Output

For every secret finding, report:

\- Finding ID  
\- Secret type  
\- File and line  
\- Whether committed to Git  
\- Whether included in the client bundle  
\- Exposure severity  
\- Redacted fingerprint  
\- Required containment action  
\- Required rotation action  
\- Whether historical Git cleanup is necessary

Never reproduce the complete value.

\---

\# Phase 4 — Supabase Client Separation Audit

Find every call to \`createClient\` or equivalent Supabase client initialization.

Classify each client as:

1\. Browser client  
2\. Server user-scoped client  
3\. Server admin client  
4\. Edge Function user-scoped client  
5\. Edge Function admin client  
6\. Test client  
7\. Unknown or unsafe client

\#\# Browser Client Requirements

The browser client may use only:

\- Supabase project URL  
\- Publishable key  
\- Legacy anon key

It must rely on properly tested RLS and Storage policies.

\#\# Server User-Scoped Client Requirements

A user-scoped server client must:

\- Forward the verified user access token correctly  
\- Preserve the user's RLS context  
\- Be created per request where required  
\- Avoid sharing one authenticated client between users  
\- Avoid global mutable session state  
\- Avoid caching one user's authentication state and serving it to another

\#\# Server Admin Client Requirements

An admin client must:

\- Use a secret or service-role key only on trusted server infrastructure  
\- Exist in a clearly named server-only module  
\- Never be imported by client components  
\- Never be bundled into frontend code  
\- Never accept a user-controlled authorization token  
\- Never be used as the default database client  
\- Be limited to operations that genuinely require elevated privileges  
\- Perform its own explicit authorization before every privileged operation  
\- Not trust a user ID, role, organization ID, price, or entitlement supplied by the client  
\- Avoid persistent browser-style sessions

Review whether privileged operations could instead use:

\- User-scoped RLS  
\- A narrowly scoped database function  
\- A dedicated server endpoint  
\- A dedicated database role

\#\# Required Search

Search for suspicious names such as:

\- \`supabaseAdmin\`  
\- \`adminClient\`  
\- \`serviceClient\`  
\- \`serverSupabase\`  
\- \`serviceRole\`  
\- \`SUPABASE\_SERVICE\_ROLE\_KEY\`  
\- \`SUPABASE\_SECRET\_KEY\`

For every admin-client operation, trace:

\`\`\`text  
Caller  
→ Authentication verification  
→ Authorization check  
→ Input validation  
→ Privileged operation  
→ Returned fields  
→ Audit log  
\`\`\`

\---

\# Phase 5 — Data API Exposure and Database Grants

Determine whether the application uses:

\- REST Data API  
\- GraphQL API  
\- Direct Supabase client database queries  
\- RPC calls  
\- Direct PostgreSQL connections

\#\# Exposed Schemas

Identify all schemas exposed through the Supabase Data API.

Verify:

\- Only necessary schemas are exposed.  
\- Internal schemas are not exposed.  
\- Sensitive helper tables remain in private schemas.  
\- A dedicated \`api\` schema is considered when it reduces exposure.  
\- The Data API is disabled when the application does not use it.  
\- \`auth\`, \`vault\`, and internal Supabase schemas are not accidentally exposed through custom configuration.  
\- Internal tables are not placed in an exposed schema merely for convenience.

\#\# Grants and RLS Are Separate Controls

For every exposed table, view, sequence, and function, evaluate:

1\. Which roles have object-level access?  
2\. Which rows can those roles access?  
3\. Which columns are returned?  
4\. Can the object be invoked through REST or RPC?  
5\. Does the grant exceed what the application needs?

Inspect grants for:

\- \`anon\`  
\- \`authenticated\`  
\- \`service\_role\`  
\- \`public\`  
\- Custom roles

Flag:

\- \`GRANT ALL\` without justification  
\- Unnecessary write privileges  
\- Anonymous write privileges  
\- Public function execution  
\- Broad default privileges  
\- Functions executable by every role  
\- Sequences accessible unnecessarily  
\- Sensitive views exposed to anonymous users

Bundle grants and RLS changes in the same migration.

\---

\# Phase 6 — Row Level Security Audit

This is the highest-priority Supabase section.

\#\# Inventory

Create a table containing:

| Schema | Table/View | Exposed | RLS Enabled | Forced RLS | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy | Risk |  
|---|---|---:|---:|---:|---:|---:|---:|---:|---|

Review every table reachable by \`anon\` or \`authenticated\`.

\#\# Required RLS Checks

Verify:

\- RLS is enabled on every exposed table that contains protected data.  
\- RLS was not omitted from tables created through raw SQL migrations.  
\- Policies target explicit roles such as \`authenticated\`.  
\- Anonymous access is intentional.  
\- Policies are separated by operation.  
\- Broad \`FOR ALL\` policies are avoided.  
\- SELECT policies use appropriate \`USING\` expressions.  
\- INSERT policies use appropriate \`WITH CHECK\` expressions.  
\- UPDATE policies normally include both \`USING\` and \`WITH CHECK\`.  
\- DELETE policies use appropriate \`USING\` expressions.  
\- Ownership cannot be reassigned during UPDATE.  
\- Users cannot insert rows owned by another user.  
\- Users cannot alter \`tenant\_id\`, \`organization\_id\`, \`owner\_id\`, or privileged fields.  
\- Admin access is verified by trusted database state or trusted authorization claims.  
\- Client-controlled metadata is not used as the sole authorization authority.  
\- Policy predicates handle unauthenticated users explicitly.  
\- Nullable ownership or tenant columns do not accidentally become public.  
\- Soft-deleted rows are handled correctly.  
\- Archived or disabled users lose access where required.  
\- Invite, membership, and pending-user states are handled correctly.  
\- RLS policies do not expose existence through side channels unnecessarily.

\#\# Multi-Tenant Rules

For multi-tenant applications:

\- Every tenant-owned record must have an authoritative tenant or organization relationship.  
\- The tenant must be derived from verified membership, not trusted from request input.  
\- A user must not be able to add themselves to another tenant.  
\- Membership role updates must be restricted to authorized tenant owners/admins.  
\- Removing a membership must immediately prevent future access.  
\- Tenant ownership transfer must be protected.  
\- Last-owner protections must exist where appropriate.  
\- Cross-tenant joins must remain isolated.  
\- Shared resources must have an explicit sharing model.

\#\# View Security

Review every view and materialized view.

Flag views that:

\- Run with creator privileges unexpectedly  
\- Bypass underlying table RLS  
\- Expose hidden columns  
\- Aggregate data across tenants  
\- Reveal counts or existence of restricted records

Where appropriate, require \`security\_invoker \= true\` and test the view using real user roles.

\#\# RLS Performance as Security

Identify policies that could create a denial-of-service risk through expensive per-row evaluation.

Check:

\- Columns used in RLS predicates are indexed.  
\- Membership lookups are indexed.  
\- Policy subqueries are bounded.  
\- Complex functions are not executed unnecessarily for every row.  
\- Authorization remains correct after performance optimization.

Never weaken authorization for performance.

\---

\# Phase 7 — Database Functions, RPC, Triggers, and Extensions

Inventory all:

\- SQL functions  
\- PL/pgSQL functions  
\- RPC endpoints  
\- Trigger functions  
\- Auth hooks  
\- Webhook functions  
\- Cron functions  
\- Queue consumers  
\- \`SECURITY DEFINER\` functions  
\- Extensions capable of external access

\#\# Function Security

For each function, record:

| Function | Schema | Invoker/Definer | Search Path | Granted To | User Input | External Effect | Risk |  
|---|---|---|---|---|---|---|---|

Verify:

\- \`SECURITY INVOKER\` is used by default.  
\- \`SECURITY DEFINER\` exists only when required.  
\- Every \`SECURITY DEFINER\` function has a safe, explicitly configured search path.  
\- Object references are schema-qualified.  
\- Function ownership is appropriate.  
\- Execute permissions are revoked from unauthorized roles.  
\- Privileged helper functions are placed in non-exposed schemas when practical.  
\- User-controlled identifiers are not concatenated into SQL.  
\- Dynamic SQL uses safe parameterization and identifier quoting.  
\- Functions validate ownership and tenant membership.  
\- Functions do not trust client-supplied role names.  
\- Functions return only necessary fields.  
\- Functions cannot update protected columns unexpectedly.  
\- Functions cannot bypass payment, quota, or subscription rules.  
\- Functions cannot create users or memberships without authorization.  
\- Functions are idempotent when retries are possible.

\#\# Default Function Permissions

Inspect default privileges.

Do not assume a function is private merely because the frontend does not call it.

Explicitly restrict \`EXECUTE\` access for sensitive RPC functions.

\#\# Trigger Audit

Review triggers for:

\- Privilege escalation  
\- Recursive behavior  
\- Hidden external API calls  
\- Failure handling  
\- Duplicate execution  
\- Data corruption  
\- Unsafe user metadata copying  
\- Unauthorized role assignment  
\- Unhandled deletion paths  
\- PII replication to logs or third parties

\#\# Auth Hooks

For Auth hooks:

\- Grant execution only to the required Supabase Auth role.  
\- Revoke execution from \`public\`, \`anon\`, and \`authenticated\` unless explicitly necessary.  
\- Validate all hook input.  
\- Fail safely.  
\- Do not grant roles based on user-editable metadata.  
\- Do not expose hook functions through the Data API unnecessarily.

\#\# Extensions

Review enabled extensions, particularly:

\- \`http\`  
\- \`pg\_net\`  
\- \`pg\_cron\`  
\- \`vault\`  
\- Foreign Data Wrappers  
\- \`wrappers\`  
\- \`dblink\`  
\- \`postgres\_fdw\`  
\- Queue extensions  
\- GraphQL  
\- Vector extensions

Determine:

\- Who can invoke them  
\- Whether they can send data externally  
\- Where credentials are stored  
\- Whether production copies or restored environments could trigger unwanted external actions  
\- Whether extension usage is documented and required

Secrets used by database jobs, triggers, or webhooks should be stored using an appropriate protected secret mechanism, not ordinary public tables.

\---

\# Phase 8 — Supabase Auth and Session Security

Audit every authentication flow.

\#\# Server-Side Identity Verification

For server authorization decisions:

\- Do not trust an unverified session object obtained from client-controlled cookies or storage.  
\- Verify the access token using a trusted Supabase Auth verification method.  
\- Use verified claims for identity checks.  
\- Request a fresh user record when the latest account state is required.  
\- Do not authorize access based only on a decoded but unverified JWT.  
\- Validate:  
  \- Signature  
  \- Issuer  
  \- Audience where applicable  
  \- Expiration  
  \- Not-before time  
  \- Project identity  
  \- Session state where relevant

\#\# Session Handling

Verify:

\- Secure cookie settings where cookie-based auth is used  
\- \`HttpOnly\` where compatible with the architecture  
\- \`Secure\` in production  
\- Appropriate \`SameSite\`  
\- Proper cookie path and domain  
\- No session token in logs  
\- No access token in URLs  
\- No refresh token exposed to analytics  
\- Logout removes or invalidates applicable session state  
\- Password changes terminate sessions where expected  
\- Disabled or deleted users lose access  
\- Session lifetime matches application risk  
\- Admin accounts do not retain unlimited unattended sessions without justification

\#\# OAuth and Redirect Security

Review:

\- OAuth callback routes  
\- Allowed redirect URLs  
\- Wildcard redirect patterns  
\- Preview deployment redirects  
\- Open redirect vulnerabilities  
\- PKCE usage where appropriate  
\- State and nonce handling  
\- Account linking  
\- Email identity collisions  
\- Provider-specific configuration  
\- Tokens accidentally stored in URLs, logs, or analytics

Production redirect allowlists should be narrow and intentional.

\#\# Password and Recovery

Verify:

\- Reasonable password-strength requirements  
\- Leaked-password protection when available and appropriate  
\- Reauthentication for sensitive changes  
\- Password-reset tokens are not logged  
\- Reset tokens expire  
\- Reset flows do not reveal whether an email exists  
\- Reset redirects cannot be redirected to attacker-controlled domains  
\- Password changes cannot be made using stale or unverified identity  
\- Passwords are never handled or stored by custom application tables

\#\# OTP and Magic Links

Check:

\- Expiration  
\- One-time usage  
\- Rate limits  
\- Replay resistance  
\- Email enumeration  
\- Redirect restrictions  
\- Logging  
\- Brute-force resistance

\#\# Signup and Abuse Protection

Review:

\- CAPTCHA or bot protection  
\- Signup rate limits  
\- OTP rate limits  
\- Password-reset limits  
\- Email verification requirements  
\- Disposable email handling if relevant  
\- Invite-only logic  
\- Automatic profile creation  
\- Signup-trigger privilege escalation

\#\# MFA

Require or strongly recommend MFA for:

\- Application administrators  
\- Organization owners  
\- Billing administrators  
\- Users accessing especially sensitive data

Where MFA is enforced:

\- Verify the authentication assurance level.  
\- Enforce high-risk operations at AAL2.  
\- Do not enforce MFA only by hiding UI controls.  
\- Test that AAL1 users cannot call protected APIs directly.

\#\# Authorization Claims

Verify:

\- Roles are not accepted from client input.  
\- User-editable metadata is not used as authoritative authorization data.  
\- Authorization claims cannot be modified by ordinary users.  
\- Stale JWT claims are considered when roles or memberships change.  
\- Database membership checks are used when immediate revocation is required.

\---

\# Phase 9 — Supabase Storage Security

Inventory all buckets.

Create:

| Bucket | Public/Private | Purpose | File Size Limit | MIME Allowlist | Read Policy | Upload Policy | Update Policy | Delete Policy | Risk |  
|---|---|---|---|---|---|---|---|---|---|

\#\# Bucket Configuration

Verify:

\- Buckets are private by default unless files are intentionally public.  
\- Public buckets contain no sensitive or user-private data.  
\- File-size limits are configured.  
\- Allowed MIME types are restricted.  
\- Executable or dangerous file types are blocked unless required.  
\- User-generated HTML, SVG, or script-capable content is handled safely.  
\- Bucket names and paths do not expose sensitive information.

\#\# Storage RLS

Inspect policies on \`storage.objects\`.

Verify separately:

\- SELECT/download  
\- INSERT/upload  
\- UPDATE/overwrite  
\- DELETE

Test:

\- User A cannot read User B's file.  
\- User A cannot overwrite User B's file.  
\- User A cannot delete User B's file.  
\- User A cannot upload into another tenant's folder.  
\- A user cannot manipulate a path to escape ownership restrictions.  
\- Anonymous users cannot enumerate private files.  
\- Upsert behavior cannot replace another user's object.  
\- File ownership remains correct after renaming or moving.

Do not rely only on folder naming. Policies must enforce the relationship.

\#\# Signed URLs

Verify:

\- Signed URLs are created only after authorization.  
\- Expiration is as short as practical.  
\- Signed URLs are not logged.  
\- Signed URLs are not stored in analytics.  
\- Cached signed URLs do not remain available beyond intended access.  
\- Users cannot request signed URLs for arbitrary paths.  
\- Download endpoints validate ownership before signing.

\#\# Upload Validation

Check:

\- Client MIME type is not trusted by itself.  
\- Server-side validation inspects actual file content where necessary.  
\- File names are normalized or generated.  
\- File names are not inserted into HTML unsafely.  
\- Path traversal is prevented.  
\- Maximum decompressed size is considered for archives.  
\- Image processing is bounded.  
\- Malware scanning is considered for untrusted documents.  
\- Uploaded files cannot execute within the application origin.  
\- Private content is never served through a public URL helper.

\#\# Deletion

Ensure account or tenant deletion handles:

\- Storage objects  
\- Database references  
\- Generated files  
\- Thumbnails  
\- External copies  
\- Cached signed links

\---

\# Phase 10 — Edge Functions and Server APIs

Inventory every Supabase Edge Function and application API route.

For each endpoint, document:

| Endpoint | Public | Auth Method | Authorization | Input Schema | Rate Limit | Uses Admin Client | External Calls | Risk |  
|---|---:|---|---|---|---|---:|---|---|

\#\# Authentication

Verify:

\- Protected functions require valid authentication.  
\- Disabling platform JWT verification is justified.  
\- Public functions implement their own appropriate authentication.  
\- Webhook endpoints verify provider signatures.  
\- Cron or machine-to-machine functions use dedicated secrets.  
\- Internal secrets are compared safely.  
\- Authentication is not based on a request-body user ID.

Flag every function configured with disabled JWT verification.

For each such function, identify its compensating control:

\- Webhook signature  
\- Dedicated secret  
\- Scheduled-job authentication  
\- Public endpoint with strict rate limiting  
\- Other documented mechanism

No compensating control means a High or Critical finding.

\#\# Authorization

After authentication, verify:

\- User ownership  
\- Tenant membership  
\- Role  
\- Subscription status  
\- Resource status  
\- Quotas  
\- Operation-specific permission

Authentication alone is not authorization.

\#\# Admin Client Use

For every server endpoint using the admin Supabase client:

\- Verify the caller first.  
\- Authorize the exact operation.  
\- Validate every resource ID.  
\- Load authoritative resource ownership from the database.  
\- Do not trust user-supplied tenant IDs.  
\- Return a field allowlist.  
\- Record an audit event for sensitive actions.

\#\# Request Validation

Require runtime validation for:

\- JSON bodies  
\- Query parameters  
\- Route parameters  
\- Headers  
\- File metadata  
\- Webhook payloads

Reject:

\- Unknown fields where appropriate  
\- Invalid UUIDs  
\- Negative quantities  
\- Excessively large strings  
\- Deeply nested JSON  
\- Unexpected arrays  
\- Unsupported content types  
\- Duplicate or ambiguous parameters

\#\# CORS

Verify:

\- Allowed origins are explicit in production.  
\- Credentials are not combined with wildcard origins.  
\- Preflight requests are handled correctly.  
\- Allowed headers and methods are minimized.  
\- Development origins do not leak into production.  
\- CORS is not treated as protection against direct API calls.

\#\# Error Handling

External responses must not reveal:

\- Stack traces  
\- SQL queries  
\- Table names unnecessarily  
\- File paths  
\- Environment variables  
\- Tokens  
\- Database connection information  
\- Internal service URLs  
\- Payment provider secrets

Use:

\- Generic client-safe message  
\- Stable error code  
\- Correlation ID  
\- Detailed redacted server-side log

\#\# Webhooks

For Stripe, Razorpay, or other webhooks:

\- Verify the signature using the provider's documented process.  
\- Use the unmodified raw body when required.  
\- Enforce timestamp tolerance where supported.  
\- Prevent replay.  
\- Store processed event IDs.  
\- Make processing idempotent.  
\- Handle duplicate and out-of-order events.  
\- Do not grant access based only on redirect/success pages.  
\- Load prices and entitlements from trusted server-side configuration.  
\- Verify customer, account, currency, amount, product, and environment.  
\- Separate test and live credentials.

\---

\# Phase 11 — Supabase Realtime Security

Determine which Realtime features are used:

\- Postgres Changes  
\- Broadcast  
\- Presence

\#\# Postgres Changes

Verify:

\- Only necessary tables are included in the Realtime publication.  
\- RLS protects subscribed records.  
\- Users cannot subscribe to another user's or tenant's data.  
\- Sensitive columns are not unnecessarily transmitted.  
\- Filters are used where appropriate.  
\- Realtime does not reveal deleted or historical data unexpectedly.  
\- Authorization policies remain performant under connection load.

\#\# Broadcast and Presence

Verify:

\- Sensitive channels are private.  
\- Authorization policies exist for \`realtime.messages\`.  
\- Users can join only allowed topics.  
\- Users can broadcast only to allowed topics.  
\- Users can receive only allowed messages.  
\- Presence payloads contain no unnecessary PII.  
\- Channel topic names do not expose secrets or sensitive IDs.  
\- A user cannot guess another tenant's channel name and join.  
\- Tokens are refreshed correctly for long-lived connections.  
\- Channels are cleaned up on logout and tenant changes.

Test two users and two tenants against every private channel type.

\---

\# Phase 12 — Payment, Subscription, and Business Logic

When payments or paid plans exist, audit:

\#\# Price Integrity

\- Never trust prices calculated by the client.  
\- Never trust client-supplied plan names.  
\- Never trust client-supplied discount amounts.  
\- Load product and price identifiers from trusted server configuration.  
\- Verify currency.  
\- Reject zero or negative amounts unless explicitly supported.  
\- Prevent quantity manipulation.  
\- Prevent discount stacking.  
\- Prevent coupon reuse beyond intended rules.

\#\# Entitlements

\- Grant paid access only after verified server-side confirmation.  
\- Do not grant access from a success-page redirect.  
\- Handle refunds, disputes, failed renewals, and cancellations.  
\- Verify webhook environment.  
\- Prevent users from modifying subscription rows directly.  
\- Protect entitlement columns with RLS and column restrictions.  
\- Ensure admin clients do not update entitlement state from untrusted requests.

\#\# Replay and Idempotency

\- Store payment event IDs.  
\- Make handlers idempotent.  
\- Prevent duplicate credits.  
\- Prevent duplicated orders.  
\- Handle webhook retries safely.  
\- Handle out-of-order events.

\#\# Trials and Referrals

Test:

\- Repeated trial creation  
\- New accounts for the same customer  
\- Self-referral  
\- Circular referral  
\- Unlimited promo reuse  
\- Email alias abuse  
\- Tenant switching to regain free allowances  
\- Deleting and recreating accounts  
\- Race conditions when redeeming credits

\---

\# Phase 13 — Input, Output, Browser, and API Security

Review against common web vulnerabilities.

\#\# Injection

Check for:

\- SQL injection  
\- Dynamic SQL injection  
\- PostgREST filter manipulation  
\- Command injection  
\- Template injection  
\- Header injection  
\- Email header injection  
\- Path traversal  
\- Unsafe regular expressions  
\- Server-side request forgery  
\- XML-related attacks where applicable

Use parameterized queries and strict allowlists.

\#\# Cross-Site Scripting

Inspect every place user-controlled data is rendered.

Check:

\- Rich text  
\- Markdown  
\- Usernames  
\- Bios  
\- Comments  
\- File names  
\- Search results  
\- AI-generated HTML  
\- Admin panels  
\- Email templates  
\- Notification content

Require context-appropriate escaping and sanitization.

Avoid unsafe rendering APIs unless sanitized.

\#\# CSRF

For cookie-authenticated state-changing routes:

\- Verify SameSite protections.  
\- Require CSRF tokens or origin validation where necessary.  
\- Reject cross-origin state-changing requests.  
\- Protect logout, email change, password change, billing, and admin actions.

\#\# Security Headers

Verify production responses include an appropriate set of:

\- Content-Security-Policy  
\- Strict-Transport-Security  
\- X-Content-Type-Options  
\- Referrer-Policy  
\- Permissions-Policy  
\- Frame protection through CSP \`frame-ancestors\` or equivalent  
\- Cache controls for sensitive responses

Build a CSP compatible with the actual application. Do not blindly allow unsafe inline or eval execution.

\#\# Cache Security

Ensure private responses are not cached publicly.

Check:

\- CDN behavior  
\- Framework route caching  
\- Server component caching  
\- API responses  
\- Authentication pages  
\- User dashboards  
\- Signed URLs  
\- Shared hosting caches

\---

\# Phase 14 — Dependency and Supply-Chain Security

Inspect:

\- Package manifests  
\- Lockfiles  
\- Dependency versions  
\- Deprecated libraries  
\- Known vulnerabilities  
\- Unmaintained authentication packages  
\- Post-install scripts  
\- Git dependencies  
\- Unpinned dependencies  
\- Duplicate vulnerable versions  
\- Supabase client version  
\- Deno dependencies used by Edge Functions  
\- GitHub Actions  
\- Third-party CI actions  
\- Build plugins  
\- Browser extensions or external scripts

Verify:

\- A lockfile exists and is used in CI.  
\- CI uses reproducible installation.  
\- Critical dependencies are pinned appropriately.  
\- CI actions are pinned to trusted releases or immutable references where required.  
\- Dependabot or equivalent monitoring is considered.  
\- Source maps are not publicly exposing sensitive source unnecessarily.  
\- Production builds disable debug tooling.  
\- Preview deployments cannot access unnecessary production data.

Run the package manager's supported audit command when available.

Do not upgrade major versions automatically during a security audit unless explicitly authorized.

\---

\# Phase 15 — Personal Data and Privacy Audit

Build a complete data-flow map.

For every data category, report:

| Data | Collection Point | Database Table | Storage Bucket | Log Destination | Third Party | Retention | Deletion Method |  
|---|---|---|---|---|---|---|---|

Include:

\- Email  
\- Phone  
\- Name  
\- Address  
\- Date of birth  
\- IP address  
\- Device information  
\- Uploaded documents  
\- Images  
\- Payment identifiers  
\- Messages  
\- AI prompts  
\- AI responses  
\- Vector embeddings  
\- Analytics identifiers  
\- Support information

\#\# Logging

Inspect:

\- \`console.log\`  
\- Structured logger calls  
\- Database logs  
\- Edge Function logs  
\- Error-reporting breadcrumbs  
\- Analytics events  
\- Payment logs  
\- Email logs  
\- AI request logs

Remove or redact:

\- Passwords  
\- Access tokens  
\- Refresh tokens  
\- OTPs  
\- Magic links  
\- Authorization headers  
\- Cookie headers  
\- Signed URLs  
\- Full payment details  
\- Private documents  
\- Unnecessary email or phone values  
\- Full AI prompts containing sensitive data

\#\# Third Parties

For every integration, list exactly what is sent.

Apply data minimization.

Examples:

\- Analytics  
\- Error monitoring  
\- AI providers  
\- Email providers  
\- SMS providers  
\- Payment processors  
\- Customer-support software  
\- Automation tools  
\- Webhook destinations

\#\# Data Deletion

Verify that account deletion addresses:

\- Public profile  
\- Private records  
\- Organization memberships  
\- Storage objects  
\- Auth user  
\- AI conversation history  
\- Embeddings  
\- Analytics identifiers where supported  
\- Payment-provider references where legally appropriate  
\- External integration records

Document whether deletion is immediate, delayed, anonymized, or legally retained.

\---

\# Phase 16 — Abuse, Rate Limits, and Resource Exhaustion

Identify expensive or abuse-prone operations:

\- Signup  
\- Login  
\- OTP  
\- Password reset  
\- Email sending  
\- SMS sending  
\- File uploads  
\- Image processing  
\- AI requests  
\- Embedding generation  
\- Search  
\- Export  
\- Report generation  
\- PDF generation  
\- Invitations  
\- Messaging  
\- Realtime connections  
\- Webhook endpoints  
\- RPC calls  
\- Admin endpoints

Apply appropriate limits by:

\- IP  
\- Authenticated user  
\- Tenant  
\- API key  
\- Payment plan  
\- Resource  
\- Time window

Test safely for:

\- Parallel requests  
\- Duplicate submissions  
\- Race conditions  
\- Storage filling  
\- Large request bodies  
\- Deep JSON  
\- Large pagination ranges  
\- Unbounded database queries  
\- Unlimited exports  
\- AI credit bypass  
\- Repeated failed jobs  
\- Retry storms

Do not conduct destructive load tests.

\---

\# Phase 17 — AI and LLM Security

Complete this section when the application uses AI.

Audit:

\- Prompt injection  
\- Cross-user conversation access  
\- Cross-tenant vector retrieval  
\- Retrieval authorization  
\- Tool calling  
\- Agent permissions  
\- System-prompt exposure  
\- Secret disclosure  
\- Untrusted URL fetching  
\- File parsing  
\- Code execution  
\- Database actions initiated by AI  
\- Payment or admin actions initiated by AI  
\- Sensitive data sent to model providers  
\- Model output rendered as HTML  
\- Rate and token limits  
\- Cost abuse

\#\# Required Controls

\- Authorization must be applied before retrieval.  
\- Do not retrieve all vectors and filter only after model generation.  
\- Every embedding row must retain an authoritative owner or tenant relationship.  
\- Tool permissions must be narrower than the user's general application access.  
\- High-impact actions require deterministic validation and, where appropriate, user confirmation.  
\- Model output must never directly determine authorization.  
\- Model-generated SQL, code, URLs, or commands must not execute without validation.  
\- Secrets must never be added to prompts.  
\- External URL fetching must block private/internal network addresses.  
\- User-provided files must be treated as untrusted.  
\- AI outputs rendered in the browser must be escaped or sanitized.

\---

\# Phase 18 — Deployment and Supabase Dashboard Configuration

Some settings cannot be proven from repository code.

Create a separate \`Manual Dashboard Verification\` checklist.

Verify or request screenshots/configuration evidence for:

\#\# API and Database

\- Current publishable and secret key usage  
\- Legacy anon and service-role key status  
\- Unused legacy keys disabled where migration is complete  
\- Data API enabled only when required  
\- Exposed schemas  
\- SSL enforcement  
\- Network restrictions  
\- Database password strength and rotation process  
\- Connection logging  
\- Security Advisor findings  
\- Performance Advisor findings  
\- Database extensions  
\- Realtime publication  
\- Backups  
\- Point-in-time recovery where risk requires it

\#\# Auth

\- Site URL  
\- Redirect allowlist  
\- Password requirements  
\- Leaked-password protection  
\- CAPTCHA  
\- Auth rate limits  
\- Email confirmation  
\- OTP expiration  
\- Session lifetime  
\- Inactivity timeout  
\- Single-session restrictions if required  
\- MFA policy  
\- SMTP configuration  
\- Audit logs  
\- OAuth provider secrets

\#\# Storage

\- Public/private bucket status  
\- MIME restrictions  
\- File-size limits  
\- Storage policies

\#\# Edge Functions

\- Function JWT-verification configuration  
\- Function secrets  
\- Public webhook functions  
\- Deployed function versions  
\- CORS configuration

\#\# Organization Access

\- Supabase organization members  
\- Owner and administrator roles  
\- Former employee access  
\- MFA for dashboard administrators  
\- Personal access tokens  
\- CI management tokens  
\- Least-privilege project access

Mark every item:

\- \`VERIFIED\`  
\- \`FAILED\`  
\- \`NOT ACCESSIBLE\`  
\- \`NOT APPLICABLE\`

\---

\# Phase 19 — Read-Only Database Inspection

When a local or authorized read-only database connection is available, inspect the catalogs.

Do not execute modifications during the discovery phase.

Example inspection queries may include:

\`\`\`sql  
\-- Tables and RLS status  
select  
  n.nspname as schema\_name,  
  c.relname as object\_name,  
  c.relkind,  
  c.relrowsecurity as rls\_enabled,  
  c.relforcerowsecurity as force\_rls,  
  c.reloptions  
from pg\_class c  
join pg\_namespace n on n.oid \= c.relnamespace  
where n.nspname not in ('pg\_catalog', 'information\_schema')  
  and c.relkind in ('r', 'p', 'v', 'm')  
order by n.nspname, c.relname;  
\`\`\`

\`\`\`sql  
\-- RLS policies  
select  
  schemaname,  
  tablename,  
  policyname,  
  permissive,  
  roles,  
  cmd,  
  qual,  
  with\_check  
from pg\_policies  
order by schemaname, tablename, policyname;  
\`\`\`

\`\`\`sql  
\-- Table grants  
select  
  table\_schema,  
  table\_name,  
  grantee,  
  privilege\_type  
from information\_schema.role\_table\_grants  
where grantee in ('anon', 'authenticated', 'service\_role', 'PUBLIC')  
order by table\_schema, table\_name, grantee, privilege\_type;  
\`\`\`

\`\`\`sql  
\-- Routine grants  
select  
  routine\_schema,  
  routine\_name,  
  grantee,  
  privilege\_type  
from information\_schema.role\_routine\_grants  
where grantee in ('anon', 'authenticated', 'service\_role', 'PUBLIC')  
order by routine\_schema, routine\_name, grantee;  
\`\`\`

\`\`\`sql  
\-- Function security mode and configuration  
select  
  n.nspname as schema\_name,  
  p.proname as function\_name,  
  pg\_get\_function\_identity\_arguments(p.oid) as arguments,  
  p.prosecdef as security\_definer,  
  p.proconfig as function\_config,  
  r.rolname as owner  
from pg\_proc p  
join pg\_namespace n on n.oid \= p.pronamespace  
join pg\_roles r on r.oid \= p.proowner  
where n.nspname not in ('pg\_catalog', 'information\_schema')  
order by n.nspname, p.proname;  
\`\`\`

\`\`\`sql  
\-- Enabled extensions  
select  
  extname,  
  extversion  
from pg\_extension  
order by extname;  
\`\`\`

\`\`\`sql  
\-- Realtime publication tables  
select  
  pubname,  
  schemaname,  
  tablename  
from pg\_publication\_tables  
order by pubname, schemaname, tablename;  
\`\`\`

\`\`\`sql  
\-- Storage bucket configuration  
select  
  id,  
  name,  
  public,  
  file\_size\_limit,  
  allowed\_mime\_types  
from storage.buckets  
order by name;  
\`\`\`

Do not print sensitive row data merely to demonstrate access.

\---

\# Phase 20 — Required Security Tests

Create automated tests whenever the project supports local Supabase development.

Prefer:

\- pgTAP for database and RLS tests  
\- Integration tests for API routes  
\- Unit tests for authorization helpers  
\- Webhook fixture tests  
\- End-to-end tests for critical authentication flows

\#\# Minimum RLS Test Matrix

For every protected resource, test:

| Actor | SELECT | INSERT | UPDATE | DELETE |  
|---|---:|---:|---:|---:|  
| Anonymous | Expected result | Expected result | Expected result | Expected result |  
| User A on own row | Allow/deny | Allow/deny | Allow/deny | Allow/deny |  
| User A on User B row | Deny | Deny | Deny | Deny |  
| Tenant A user on Tenant B row | Deny | Deny | Deny | Deny |  
| Tenant member | Expected | Expected | Expected | Expected |  
| Tenant admin | Expected | Expected | Expected | Expected |  
| Application admin | Expected | Expected | Expected | Expected |

\#\# Mandatory Negative Tests

Test that:

1\. Changing an ID does not expose another user's record.  
2\. Changing \`user\_id\` during INSERT fails.  
3\. Changing \`user\_id\` during UPDATE fails.  
4\. Changing \`tenant\_id\` during UPDATE fails.  
5\. A user cannot assign themselves an admin role.  
6\. A user cannot update subscription status.  
7\. A user cannot call privileged RPC functions.  
8\. Anonymous callers cannot access protected functions.  
9\. User A cannot download User B's private file.  
10\. User A cannot generate a signed URL for User B's file.  
11\. User A cannot overwrite User B's file.  
12\. User A cannot join Tenant B's private Realtime channel.  
13\. A forged payment-success request grants no access.  
14\. An invalid webhook signature is rejected.  
15\. A duplicate webhook does not duplicate benefits.  
16\. An expired or malformed JWT is rejected.  
17\. An AAL1 session cannot perform an AAL2 operation.  
18\. Server authorization does not trust an unverified session object.  
19\. Deleted or disabled users cannot continue sensitive operations.  
20\. API responses do not return unnecessary fields.

\#\# Suggested Commands

Use only tools already present or approved for the repository.

Examples:

\`\`\`bash  
\# Secret scanner, when installed  
gitleaks detect \--source . \--redact

\# Supabase database linting  
supabase db lint \--local \--level warning

\# Supabase database tests  
supabase test db

\# Project linting and type checking  
npm run lint  
npm run typecheck  
npm test  
\`\`\`

Adapt commands to the actual package manager.

Do not install new global tools or upload code externally without permission.

\---

\# Phase 21 — Attacker-Perspective Verification

Act as a malicious but authorized test user in local or staging.

Use two ordinary users and, for multi-tenant systems, two separate tenants.

Attempt safe versions of:

\#\# Horizontal Privilege Escalation

\- Replace resource IDs.  
\- Replace user IDs.  
\- Replace organization IDs.  
\- Modify nested relation IDs.  
\- Access predictable object paths.  
\- Request another user's signed URL.  
\- Subscribe to another tenant's Realtime topic.

\#\# Vertical Privilege Escalation

\- Call admin endpoints directly.  
\- Modify role fields.  
\- Add admin claims to request bodies.  
\- Change route names.  
\- Invoke hidden RPC functions.  
\- Replay administrator requests using an ordinary token.  
\- Bypass UI-only restrictions.

\#\# Authentication Bypass

\- No token  
\- Empty token  
\- Expired token  
\- Malformed token  
\- Token from another project  
\- Publishable key without user authentication  
\- Stale session  
\- Disabled user  
\- Deleted user

\#\# Business-Logic Manipulation

\- Negative values  
\- Zero values  
\- Duplicate operations  
\- Parallel operations  
\- Replayed webhooks  
\- Reused coupons  
\- Repeated free trials  
\- Repeated invitations  
\- Self-referrals  
\- Tenant switching  
\- Client-forged entitlement fields

\#\# Internal Exposure

Check for public access to:

\- \`.env\`  
\- \`.git\`  
\- Source maps  
\- Debug endpoints  
\- Seed endpoints  
\- API documentation  
\- Health endpoints with sensitive details  
\- Database dashboards  
\- Supabase Studio  
\- Internal logs  
\- Function error traces  
\- Deployment metadata

Do not perform destructive exploitation.

Provide a proof of concept using synthetic IDs and test data only.

\---

\# Phase 22 — Safe Remediation Workflow

After completing discovery:

\#\# Step 1 — Report Before Changing

Present all Critical and High findings before making significant changes.

\#\# Step 2 — Prioritize

Fix in this order:

1\. Exposed privileged secrets  
2\. Unauthenticated data access  
3\. Cross-user or cross-tenant access  
4\. Privilege escalation  
5\. Payment or entitlement forgery  
6\. Private file exposure  
7\. Authentication takeover  
8\. Public privileged RPC functions  
9\. Webhook forgery or replay  
10\. PII leakage  
11\. Resource abuse  
12\. Security-hardening improvements

\#\# Step 3 — Create Reviewable Fixes

For database fixes:

\- Create timestamped migrations.  
\- Include grants and RLS policies together.  
\- Add rollback notes.  
\- Add pgTAP tests.  
\- Do not disable RLS.  
\- Do not edit historical migrations already deployed unless the repository's migration policy explicitly allows it.

For code fixes:

\- Use small commits or isolated patches.  
\- Add authorization near the privileged operation.  
\- Add runtime validation.  
\- Add regression tests.  
\- Avoid unrelated refactoring.

\#\# Step 4 — Re-run Tests

After every security change:

\- Run database tests.  
\- Run application tests.  
\- Re-run the failing exploit test.  
\- Confirm legitimate access still works.  
\- Confirm cross-user access still fails.  
\- Re-run linting and type checking.

\#\# Step 5 — Manual Actions

Clearly list actions that cannot be completed from code, such as:

\- Key rotation  
\- Dashboard redirect changes  
\- Enabling CAPTCHA  
\- Enabling MFA  
\- Changing Auth rate limits  
\- Enabling SSL enforcement  
\- Applying network restrictions  
\- Reviewing organization members  
\- Enabling backups or PITR

\---

\# Severity Model

Use the following severity levels.

\#\# Critical

Examples:

\- Secret/service-role key exposed publicly  
\- Anonymous access to private customer data  
\- Cross-tenant database access  
\- Remote admin privilege escalation  
\- Authentication takeover  
\- Payment entitlement forgery  
\- Arbitrary privileged RPC execution  
\- Private storage bucket exposed publicly

\#\# High

Examples:

\- Cross-user IDOR  
\- Weak admin authorization  
\- Forged webhooks  
\- Password-reset weakness  
\- Sensitive PII exposed in logs  
\- Storage overwrite across users  
\- Server trusting unverified session identity  
\- Dangerous \`SECURITY DEFINER\` function exposed broadly

\#\# Medium

Examples:

\- Missing rate limits  
\- Excessive API fields  
\- Overly broad CORS  
\- Weak session configuration  
\- Missing MIME restrictions  
\- Broad but currently unexploitable grants  
\- Missing MFA for privileged users

\#\# Low

Examples:

\- Missing hardening headers  
\- Verbose non-sensitive errors  
\- Outdated low-risk dependency  
\- Missing audit event  
\- Security documentation gap

\#\# Informational

\- Best-practice improvement  
\- Defense-in-depth recommendation  
\- Manual verification item

For each finding include:

\- Severity  
\- Confidence  
\- Likelihood  
\- Impact  
\- Exploit prerequisites  
\- Affected users  
\- Data at risk  
\- Whether exploitation was verified  
\- Exact evidence

\---

\# Required Final Report Format

Produce the final report using this structure.

\#\# 1\. Executive Summary

\- Overall security posture  
\- Number of findings by severity  
\- Most serious risk  
\- Whether production launch is recommended

\#\# 2\. Architecture and Trust Boundaries

Summarize the verified architecture.

\#\# 3\. Supabase Exposure Summary

Include:

\- Keys used  
\- Exposed schemas  
\- Data API status  
\- RLS coverage  
\- Public buckets  
\- Edge Functions  
\- Realtime exposure  
\- Admin-client locations

\#\# 4\. Findings

Use this table:

| ID | Severity | Category | Finding | Location | Exploitable | Status |  
|---|---|---|---|---|---:|---|

For every finding provide:

\#\#\# \`\[FINDING-ID\] Finding title\`

\- \*\*Severity:\*\*  
\- \*\*Confidence:\*\*  
\- \*\*Affected component:\*\*  
\- \*\*File/table/function:\*\*  
\- \*\*Evidence:\*\*  
\- \*\*Attack scenario:\*\*  
\- \*\*Potential impact:\*\*  
\- \*\*Existing control:\*\*  
\- \*\*Why existing control is insufficient:\*\*  
\- \*\*Recommended fix:\*\*  
\- \*\*Patch or migration:\*\*  
\- \*\*Regression test:\*\*  
\- \*\*Manual action required:\*\*  
\- \*\*Status:\*\*

\#\# 5\. RLS Coverage Matrix

Show every relevant table and operation.

\#\# 6\. Function and RPC Matrix

Show all callable functions and execution privileges.

\#\# 7\. Storage Security Matrix

Show every bucket and policy.

\#\# 8\. Edge Function and API Matrix

Show auth, authorization, validation, and rate limits.

\#\# 9\. Personal Data Flow Map

Show collection, storage, third-party transfer, retention, and deletion.

\#\# 10\. Secrets Report

List secret names and locations only. Redact values.

\#\# 11\. Automated Test Results

For every test:

\- Command  
\- Result  
\- Evidence  
\- Failures  
\- Coverage limitation

\#\# 12\. Manual Dashboard Checklist

Clearly identify what requires Supabase Dashboard access.

\#\# 13\. Changes Made

For each fix:

\- File changed  
\- Migration created  
\- Test added  
\- Reason  
\- Risk of change

\#\# 14\. Unresolved Risks

Include:

\- Accepted risks  
\- Deferred fixes  
\- Unverified settings  
\- Missing access  
\- Missing test environment

\#\# 15\. Production Launch Decision

Choose exactly one:

\- \`APPROVED\`  
\- \`APPROVED WITH CONDITIONS\`  
\- \`NOT APPROVED\`

A production launch must be \`NOT APPROVED\` when any of these remain:

\- Unresolved Critical finding  
\- Unresolved High unauthorized-access finding  
\- Untested core RLS policy  
\- Privileged key exposed  
\- Payment entitlement based on client input  
\- Public private-data bucket  
\- Unverified webhook signature  
\- Unauthenticated privileged Edge Function

\#\# 16\. Prioritized Remediation Plan

Organize fixes into:

\- Before deployment  
\- Within 7 days  
\- Within 30 days  
\- Longer-term hardening

\---

\# Definition of Done

The audit is complete only when:

\- \[ \] All Supabase clients are classified.  
\- \[ \] No privileged key is client-accessible.  
\- \[ \] All exposed schemas are documented.  
\- \[ \] Grants are reviewed for \`anon\`, \`authenticated\`, \`public\`, and privileged roles.  
\- \[ \] Every protected exposed table has verified RLS.  
\- \[ \] SELECT, INSERT, UPDATE, and DELETE behavior is tested separately.  
\- \[ \] Cross-user access tests pass.  
\- \[ \] Cross-tenant access tests pass where applicable.  
\- \[ \] Views are checked for RLS bypass.  
\- \[ \] RPC and database function execution grants are reviewed.  
\- \[ \] Every \`SECURITY DEFINER\` function is justified and hardened.  
\- \[ \] Auth flows and server-side identity verification are reviewed.  
\- \[ \] OAuth redirects are restricted.  
\- \[ \] Password reset, OTP, and magic-link flows are reviewed.  
\- \[ \] Privileged users have an MFA recommendation or enforcement.  
\- \[ \] Every Storage bucket and operation has been reviewed.  
\- \[ \] Signed URL authorization is tested.  
\- \[ \] Every Edge Function has documented authentication and authorization.  
\- \[ \] Every function with disabled JWT verification has a verified compensating control.  
\- \[ \] Realtime channels and publications are reviewed.  
\- \[ \] Payment and webhook logic is tested where applicable.  
\- \[ \] Personal-data flows and logging are reviewed.  
\- \[ \] Rate limits and resource-abuse controls are reviewed.  
\- \[ \] Dependencies and CI configuration are reviewed.  
\- \[ \] Security Advisor findings are reviewed or marked inaccessible.  
\- \[ \] Automated regression tests have been added.  
\- \[ \] Findings include exact evidence.  
\- \[ \] No claim is made for a test that was not executed.  
\- \[ \] The final launch decision is explicit.

Begin by inspecting the repository and producing:

1\. The completed Project Context  
2\. Repository Security Inventory  
3\. Architecture Map  
4\. Initial Threat Model  
5\. Proposed audit execution plan

Do not begin broad automatic remediation until the discovery report is complete.  
