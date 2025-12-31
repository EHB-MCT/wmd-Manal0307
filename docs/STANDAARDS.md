# 📘 Ontwikkelstandaarden – Parfum Advisor

Dit document beschrijft de afspraken rond code, structuur, tooling en workflow binnen het project. Gebruik dit als referentie bij nieuwe features of refactors.

---

## 1. Code style

- **PHP (Laravel)**
  - PSR-12 formattering, 4 spaties, snake_case voor databasekolommen.
  - Controllers hebben één verantwoordelijkheid (bv. `AdminAnalyticsController`, `AdminUserActionController`).
  - Requests worden altijd gevalideerd (`$request->validate([...])`); payloads passeren via `SanitizeInput`.
  - Services bevatten businesslogica (`UserProfileService`).
- **JavaScript/React**
  - 2 spaties, ES Modules, function components + hooks.
  - Data-attributen voor tracking: `data-track-id`, `data-track-component`, `data-track-cta`, `data-track-section`.
  - CSS per pagina/component (bv. `Questionnaire.css`).
- **Commit messages**
  - Conventionele prefixen: `feat:`, `fix:`, `chore:`, `test:`, `docs:`.
  - Meerdere features? Splits in aparte commits/branches (`feature/...`).

---

## 2. Projectstructuur

- `Backend/` – Laravel 12 API
  - `app/Console/Commands` – artisan commando’s (`sessions:close-stale`, `demo:seed`).
  - `app/Http/Controllers` – API endpoints (user init, answers, admin analytics, actions).
  - `app/Http/Middleware/SanitizeInput.php` – globalle inputcleanup.
  - `database/migrations` – alle tabellen (users, user_profiles, interactions, admin_user_actions…).
  - `database/seeders` – vaste data (vragen, parfums). Geen mock analytics.
  - `tests/Feature` – PHPUnit tests (CloseStaleSessions, AdminAnalytics, …).
- `Frontend/` – React 19 + Vite
  - `src/api` – axios wrapper (`axiosClient`) + endpoints.
  - `src/hooks` – `useInteractionTracker`, `useUserProfile`.
  - `src/pages` – `Home`, `Questionnaire`, `Explorer`, `Results`, `AdminDashboard`.
  - `src/components` – `Navbar`, `QuestionCard`, `Charts`, `Tracking/InteractionTracker`.
  - Tests via Vitest (`npm test`) zodra packages geïnstalleerd zijn.
- `docs/REPORT.md` – WMD rapport (bias, bronnen, AI).
- `docs/STANDAARDS.md` – dit document.

---

## 3. Docker workflow

1. `cp Backend/.env.example Backend/.env`
2. `docker compose up --build`
3. `docker compose exec backend php artisan migrate`
4. Optioneel demo data: `docker compose exec backend php artisan demo:seed --count=5`

Services:
- `db` (MySQL 8), `backend` (Laravel + Apache), `frontend` (Vite dev server), `phpmyadmin`.

Stoppen: `docker compose down` (en `-v` voor volumes).

---

## 4. Tracking & data cleaning

- Elk interactie-event krijgt:
  - `event_type` (`click`, `hover`, `misclick`, `cta_click`, …)
  - `metadata`: component, CTA, section, route, coördinaten.
  - Device info via `ensureDeviceContext()`.
- `SanitizeInput`:
  - verwijdert HTML, trimt whitespace, max 500 chars per veld.
  - arrays gereinigd tot max. 25 key-value paren, 2 niveaus diep.
- Database bewaart alle events (`interactions`), admins zien filters + CTA breakdown.

---

## 5. Testing & kwaliteit

- **Backend**: `docker compose exec backend php artisan test`
  - Tests resetten DB naar sqlite (`.env.testing`).
  - Feature tests voor sessions + admin analytics.
- **Frontend**: `npm run build` voor sanity check, `npm test` (Vitest) voor hooks, componenten.
- **Linting**: `npm run lint` (ESLint 9).
- Bij PR/merge: altijd `git status` controleren, geen lokale artefacten (`Backend/parfum_advisor` staat op `.gitignore`).

---

## 6. Workflow

1. Maak een branch: `git checkout -b feature/<naam>`.
2. Werk per feature (tracking, admin UI, docs).
3. Voer tests/lint uit.
4. Commit (conventioneel), push, open PR of merge in `main`.
5. Na merge: branch lokaal verwijderen `git branch -d feature/<naam>`.

---

## 7. Naming & vertaling
- Database keys blijven Engels (bv. `question_key`, `event_type`) voor consistentie met code.

