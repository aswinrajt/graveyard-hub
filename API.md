# Project Graveyard — Overview & APIs

Frontend-only SaaS UI: a dark, cyberpunk cemetery for unfinished developer projects. There is **no backend yet** — everything is mock data in `src/data/projects.ts`. Actions like bury, revive, edit, and save settings only show toasts.

## Stack

| | |
|---|---|
| **App** | `graveyard-hub` — TanStack Start + React 19 + Tailwind + shadcn/ui + Recharts |
| **Purpose** | Archive abandoned repos, tag a “cause of death,” revive ideas, and chart project history |
| **Data today** | 12 hardcoded projects (Twitter Clone, AI Chatbot, etc.) plus a mock developer profile |
| **Statuses** | `active`, `abandoned`, `buried`, `revivable` |

## Pages

| Route | What it shows |
|---|---|
| `/` | Landing: hero, stats, feature cards, 4 recent tombstones |
| `/dashboard` | Counts, activity chart, status mix, forgotten project, recently buried, tombstone grid |
| `/graveyard` | Search + filters (status, tech, cause, sort) |
| `/active` | Same archive, locked to active |
| `/revivable` | Same archive, locked to revivable |
| `/project/:id` | Detail: repo, progress, cause of death, timeline, notes, artifact placeholders |
| `/analytics` | Lifespan, revival/completion rates, charts |
| `/collections` | 4 hardcoded themed groups |
| `/profile` | Gravekeeper bio, stats, project timeline |
| `/settings` | Name/handle/bio + burial-protocol toggles |

Global chrome: sidebar, top search, bell, **Bury New Project** dialog.

---

## APIs needed for the UI to work fully

**22 endpoints** cover every screen and every button that currently only toasts. No login UI exists, so auth is listed separately.

### 1. Projects — 6 endpoints

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 1 | `GET` | `/api/projects` | Graveyard, Active, Revivable, landing showcase, dashboard tombstones, top-bar search. Query: `q`, `status`, `tech`, `cause`, `sort`, `limit` |
| 2 | `GET` | `/api/projects/:id` | Project detail (description, repo, tech, dates, status, progress, cause, epitaph, notes, commits, timeline) |
| 3 | `POST` | `/api/projects` | Bury New Project dialog |
| 4 | `PATCH` | `/api/projects/:id` | Edit on the detail page |
| 5 | `POST` | `/api/projects/:id/revive` | Revive on tombstone cards and detail |
| 6 | `POST` | `/api/projects/:id/bury` | Bury confirmation on detail |

`GET /api/projects` should also return filter options (`techs`, `causes`) so the archive dropdowns stay in sync.

### 2. Artifacts — 2 endpoints

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 7 | `GET` | `/api/projects/:id/artifacts` | Screenshots/files grid on detail |
| 8 | `POST` | `/api/projects/:id/artifacts` | Upload into those 4 placeholder slots |

### 3. Dashboard & analytics — 3 endpoints

These numbers are hardcoded today (`7.4 mo`, `18%` revival, `24%` completion, yearly series, commit/burial chart). They cannot all be derived from a simple project list.

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 9 | `GET` | `/api/dashboard` | Totals by status, top cause, 12-month activity, status distribution, recently buried |
| 10 | `GET` | `/api/projects/forgotten` | “Forgotten Project of the Day” |
| 11 | `GET` | `/api/analytics` | Avg lifespan, revival/completion/mortality rates, created vs abandoned, tech usage, causes of death, abandonment patterns |

Landing hero stats (buried / revived / avg lifespan) can reuse **#9** or **#11**.

### 4. Collections — 1 endpoint (current UI)

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 12 | `GET` | `/api/collections` | Collections page (name, description, member projects) |

There is no create/edit UI yet. If you add that later: `POST/PATCH/DELETE /api/collections` and assign/remove projects (**+4**).

### 5. Profile — 2 endpoints

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 13 | `GET` | `/api/profile` | Avatar, name, handle, bio, favorites, total/buried/revived, completion rate, chronological timeline |
| 14 | `PATCH` | `/api/profile` | Settings identity fields (name, handle, bio) |

### 6. Settings — 2 endpoints

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 15 | `GET` | `/api/settings` | Auto-bury, haunting reminders, ambient fog, terminal SFX |
| 16 | `PATCH` | `/api/settings` | Save Changes |

### 7. Search & notifications — 2 endpoints

| # | Method | Endpoint | Used by |
|---|---|---|---|
| 17 | `GET` | `/api/search?q=` | Top-bar “Search the graveyard…” (can be skipped if **#1** supports `q` well enough) |
| 18 | `GET` | `/api/notifications` | Bell icon |

### 8. Auth — 4 endpoints (no screens yet)

The app is built as a single-user demo. For a real product you still need:

| # | Method | Endpoint |
|---|---|---|
| 19 | `POST` | `/api/auth/register` |
| 20 | `POST` | `/api/auth/login` |
| 21 | `POST` | `/api/auth/logout` |
| 22 | `GET` | `/api/auth/me` |

---

## Count

| Scope | Endpoints |
|---|---|
| **Existing UI, no login** | **18** |
| **Same + auth (real SaaS)** | **22** |
| **+ collection CRUD** | **26** |

Lean option: merge revive/bury into `PATCH /projects/:id`, nest artifacts on `GET /projects/:id`, and drop a dedicated search route. That lands around **14–15** for the current UI.

Nothing is wired today — TanStack Query is in the router, but every page still imports `projects` from local mock data.
