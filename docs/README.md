# AptoHire

**Hired for what you can do.**

AptoHire is a website where students prove their skills by building real projects. An AI reviews each project and gives the student a **verified skill scorecard**. Companies can then find talented students without seeing their names until the student says yes. Universities get a dashboard to see how their students are doing.

This is a **prototype / demo**. Use only fictional (made-up) data in it.

---

## Contents

1. [How the project is organised](#1-how-the-project-is-organised)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Setup in 10 steps](#3-setup-in-10-steps)
4. [Open each website on your computer](#4-open-each-website-on-your-computer)
5. [Demo accounts](#5-demo-accounts)
6. [Folder tour](#6-folder-tour)
7. [Commands you will use](#7-commands-you-will-use)
8. [Put it online with Vercel](#8-put-it-online-with-vercel)
9. [Common problems and fixes](#9-common-problems-and-fixes)
10. [Small glossary](#10-small-glossary)

---

## 1. How the project is organised

AptoHire is **one project** that shows **five different websites**, depending on the address you open.

| Address | Who uses it | What it is |
|---|---|---|
| `aptohire.com` | Everyone | Home page, pricing, sign in, credential checker |
| `student.aptohire.com` | Students | Projects, scorecard, resume, who can see my data |
| `university.aptohire.com` | University staff (TPO) | Student lists, placements, insights |
| `organization.aptohire.com` | Recruiters | Post jobs, see anonymous candidates |
| `admin.aptohire.com` | AptoHire staff | Approvals, reviews, settings |

All five share **one database** (made with Supabase). Think of it as one big filing cabinet. Each website opens only the drawers its users are allowed to open. These rules are called **Row-Level Security (RLS)**.

On your own computer you do not need to buy the domain. The five websites open at addresses like `http://localhost:5173/student`.

---

## 2. What you need before you start

Install these free tools first.

| Tool | Why | Download |
|---|---|---|
| **Node.js** (choose "LTS") | Runs the website code | https://nodejs.org |
| **Git** | Downloads and saves your code | https://git-scm.com/downloads |
| **VS Code** | A friendly editor to read and edit files | https://code.visualstudio.com |
| **Docker Desktop** | Needed only if you want the database on your own computer | https://www.docker.com/products/docker-desktop |
| **Supabase account** (free) | Your online database | https://supabase.com |
| **Vercel account** (free) | Puts your site online | https://vercel.com |

To check that Node and Git are installed, open a terminal (in VS Code: **Terminal → New Terminal**) and type:

```bash
node --version
git --version
```

Each one should print a version number. If you see "command not found", install it again and restart VS Code.

---

## 3. Setup in 10 steps

### Step 1. Get the code

```bash
git clone <your-repository-url> aptohire
cd aptohire
```

### Step 2. Install the packages

```bash
npm install
```

This downloads everything the project needs. It can take a few minutes.

### Step 3. Create your database on Supabase

1. Go to https://supabase.com and sign in.
2. Click **New project**. Give it a name (for example `aptohire-dev`), choose a strong database password and **save it somewhere safe**, then pick the region closest to you.
3. Wait about two minutes until the project is ready.

### Step 4. Copy your project keys

In Supabase, open **Project Settings → API**. You need two values:

- **Project URL**
- **anon public key**

> **Never** share or commit the **service_role** key. It is a master key. This project only uses it inside server functions.

### Step 5. Create your settings file

```bash
cp .env.example .env.local
```

On Windows PowerShell use `copy .env.example .env.local`.

Open `.env.local` in VS Code and fill in:

```
VITE_SUPABASE_URL=paste-your-project-url
VITE_SUPABASE_ANON_KEY=paste-your-anon-key
VITE_DEMO_MODE=true
AGENT_MODE=mock
```

`AGENT_MODE=mock` means the AI review uses **built-in fake-but-realistic results**, so you do not need any AI key to try the app.

### Step 6. Build the tables in your database

The tables are described in the folder `supabase/migrations`. Install the Supabase tool and link your project:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Your **project ref** is the short code in your Supabase project URL (`https://<project-ref>.supabase.co`).

### Step 7. Add the demo data

The file `supabase/seed.sql` creates fictional universities, students, organizations and jobs. Easiest way:

1. In Supabase open **SQL Editor → New query**.
2. Open `supabase/seed.sql` in VS Code, copy everything and paste it into the query box.
3. Click **Run**.

### Step 8. (Optional) Turn on the AI review functions

The AI review runs in small server programs called Edge Functions:

```bash
npx supabase functions deploy
```

Skip this if you only want to look at the screens.

### Step 9. Start the website

```bash
npm run dev
```

The terminal prints an address, usually `http://localhost:5173`. Hold **Ctrl** (or **Cmd** on Mac) and click it.

### Step 10. Check that it works

Open `http://localhost:5173`. You should see the AptoHire home page. Go to **Log in** and use a demo account from section 5.

---

## 4. Open each website on your computer

| What you want to see | Open this address |
|---|---|
| Home page | http://localhost:5173/ |
| Student website | http://localhost:5173/student |
| University website | http://localhost:5173/university |
| Organization website | http://localhost:5173/organization |
| Admin website | http://localhost:5173/admin |

After you buy the domain and set it up (section 8), the same code answers at `student.aptohire.com`, `university.aptohire.com` and so on.

---

## 5. Demo accounts

All accounts are **fictional**. They are created by `seed.sql`. The shared demo password is written in `.env.example` (look for `DEMO_PASSWORD`). Do not use this password anywhere else.

| Role | Email | What to try |
|---|---|---|
| Admin | `admin@demo.aptohire.test` | Approve University C |
| Student at Uni A | `aarav@unia.edu.test` | Get a project, submit it, see the scorecard |
| Student at Uni B | `naman@demo.aptohire.test` | Sign in with a personal email |
| Alumnus (Uni A → Uni B) | `avi@demo.aptohire.test` | See how scores stay when you change university |
| University A staff | `tpo@unia.edu.test` | Upload a student list, see analytics |
| Organization A recruiter | `recruiter@orga.demo.test` | Post a job, see anonymous candidates |
| Organization B recruiter | `recruiter@orgb.demo.test` | Post a job with no matches |

If `VITE_DEMO_MODE=true`, the sign-in page also shows a **Demo accounts** panel with one-click buttons.

---

## 6. Folder tour

```
aptohire/
├─ README.md            ← you are here
├─ .env.example         ← a list of settings (copy to .env.local)
├─ package.json         ← the list of packages and commands
├─ vercel.json          ← settings for the Vercel host
├─ docs/                ← the plan: prd, features, architecture, design, agent
├─ src/                 ← the website code
│  ├─ main.tsx          ← where the app starts
│  ├─ app/              ← decides which website to show
│  ├─ portals/          ← one folder per website
│  │  ├─ root/          ← aptohire.com
│  │  ├─ student/
│  │  ├─ university/
│  │  ├─ organization/
│  │  └─ admin/
│  ├─ features/         ← shared building blocks (projects, scorecards, jobs...)
│  ├─ components/ui/    ← buttons, inputs, score ring, chips...
│  ├─ lib/              ← helpers (database connection, validation rules)
│  └─ styles/           ← colours, fonts, spacing
├─ supabase/            ← everything about the database
│  ├─ migrations/       ← numbered files that build the tables and rules
│  ├─ seed.sql          ← the fictional demo data
│  ├─ tests/            ← checks that the privacy rules work
│  └─ functions/        ← small server programs (AI review, consent...)
├─ e2e/                 ← automatic click-through tests
└─ prompts/             ← the prompts used to build this project with AI
```

**Where do I change things?**

- Change the text or layout of a page → `src/portals/<website>/pages`
- Change colours or fonts → `src/styles/tokens.css`
- Change who can see which data → `supabase/migrations` (ask for help first; these rules protect people's privacy)

---

## 7. Commands you will use

Type these in the terminal, inside the `aptohire` folder.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the website on your computer |
| `npm run build` | Makes the final version for putting online |
| `npm run preview` | Shows that final version locally |
| `npm run typecheck` | Looks for coding mistakes |
| `npm run lint` | Checks that the code is tidy |
| `npm run test` | Runs the small automatic tests |
| `npm run test:db` | Checks that the database privacy rules work |
| `npm run e2e` | Clicks through the demo like a person would |
| `npm run db:reset` | Rebuilds the local database and adds demo data |
| `npm run db:types` | Updates the database types for the code |

To stop the website: click in the terminal and press **Ctrl + C**.

---

## 8. Put it online with Vercel

1. Push your code to GitHub.
2. In Vercel click **Add New → Project**, pick your repository and click **Deploy**.
3. Open **Project → Settings → Environment Variables** and add the same `VITE_...` values as in `.env.local`. Add `VITE_ROOT_DOMAIN=aptohire.com`. Set `VITE_DEMO_MODE=false` for a real launch.
4. Redeploy.
5. **Domains:** after you buy `aptohire.com`, go to **Settings → Domains** and add all five names to the **same** project:
   - `aptohire.com`
   - `student.aptohire.com`
   - `university.aptohire.com`
   - `organization.aptohire.com`
   - `admin.aptohire.com`

   Vercel shows the DNS records to add at your domain provider.
6. In Supabase open **Authentication → URL Configuration** and add all five addresses to the allowed redirect URLs.

> **Free plan note:** Vercel's free "Hobby" plan is for personal, non-commercial use. It is fine for a demo. Before you charge money or run a company pilot, move to a paid plan.

---

## 9. Common problems and fixes

| Problem | Likely cause | Fix |
|---|---|---|
| `npm: command not found` | Node.js not installed | Install Node.js LTS, restart VS Code |
| White page, red errors in the browser console | `.env.local` missing or has a typo | Check the two `VITE_SUPABASE_...` values, then stop and restart `npm run dev` |
| "Invalid API key" | Copied the wrong key | Use the **anon public** key, not `service_role` |
| Login works but pages are empty | Seed data not added | Run `seed.sql` (Step 7) |
| "permission denied" or empty lists for a page you expect to see | You are signed in as the wrong role | Sign out and use the right demo account |
| "Go to your portal" screen | Your role does not match this website | Click the button to open the right website |
| AI review never finishes | Edge Functions not deployed, or the AI keys are missing | Keep `AGENT_MODE=mock`, run Step 8 |
| Video will not upload | Longer than 3:10 or larger than the size limit | Trim or compress the video |
| Supabase project was paused | Free projects pause after about a week of no use | Open the project and click **Restore** |
| Sign-in does not carry from `aptohire.com` to `student.aptohire.com` | Redirect URLs or cookie domain not set | Re-check Step 6 in section 8 and `VITE_ROOT_DOMAIN` |
| Port 5173 already in use | Another copy is running | Close the other terminal, or run `npm run dev -- --port 5174` |

Still stuck? Copy the **exact error message** and ask your AI assistant, or open an issue in the repository.

---

## 10. Small glossary

| Word | Plain meaning |
|---|---|
| **Portal** | One of the five websites (root, student, university, organization, admin) |
| **Supabase** | The online service that holds the database, logins and files |
| **Database** | Organised storage of information in tables |
| **Table** | Like a spreadsheet: columns are fields, rows are records |
| **RLS** | Rules inside the database that decide who can see which rows |
| **Migration** | A numbered file that changes the database step by step |
| **Seed data** | Fictional example data used for demos |
| **Edge Function** | A small server program, for example the AI review |
| **Mock mode** | The AI review uses built-in sample results, no AI account needed |
| **Anon key** | A public key the website uses. Safe to put in `.env.local` |
| **Service role key** | A master key. Never put it in the website code or share it |
| **Verified skill** | A skill with a score above the pass mark (50 by default) |
| **Blind / anonymized** | Companies see skills and scores, not the student's name |
| **Consent** | The student says yes before a company sees who they are |

---

**Plan documents:** `docs/prd.md` · `docs/features.md` · `docs/architecture.md` · `docs/design.md` · `docs/agent.md`
