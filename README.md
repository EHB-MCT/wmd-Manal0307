# 🧴 Parfum Advisor

Weapon of Math Destruction-project dat elke interactie logt, gebruikers segmenteert en het admin-dashboard realtime voedt. Alle analyses over bias, bronnen en AI-hulp vind je in [`docs/REPORT.md`](docs/REPORT.md).

---

## 1. Doel
Parfum Advisor verzamelt zoveel mogelijk gebruikersinteracties om een gedragsprofiel te bouwen. Dat profiel beïnvloedt het quizverloop, de getoonde aanbevelingen en admin-beslissingen. Dit document beschrijft de datastroom, de voornaamste biases en de gebruikte bronnen.


## 0. Opstarten

1. **Environment klaarzetten**
   ```bash
   cd Backend
   cp .env.example .env
   php artisan key:generate
   ```
2. **Docker starten**
   ```bash
   docker compose up --build
   docker compose exec backend php artisan migrate
   ```
3. **URLs**
   - Quiz + tracking frontend: `http://localhost:5174`
   - Admin dashboard: `http://localhost:5174/dashboard`
   - Backend API: `http://localhost:8080`
   - phpMyAdmin: `http://localhost:8081`

> Vite verwacht Node.js ≥ 20.19. Lagere versies geven enkel een waarschuwing.

Alle grafieken en tabellen zijn gebaseerd op MySQL-data. Seeders voorzien enkel vaste entiteiten (vragen, parfums). Sessions, answers, interactions, profiles en comparisons ontstaan uitsluitend door echte gebruikersacties (of via de optionele demo-command hieronder).

---

## 1. Structuur

```
wmd-Manal0307/
├── docker-compose.yml
├── Backend/ (Laravel 12)
│   ├── app/
│   │   ├── Console/Commands        # bv. sessions:close-stale
│   │   ├── Http/Controllers        # API endpoints
│   │   ├── Http/Middleware         # opschoning & tracking
│   │   └── Models/Services         # User, Session, Profile, …
│   ├── database/
│   │   ├── migrations              # tabellen voor analytics
│   │   └── seeders                 # parfums, vragen
│   └── routes/api.php              # REST API
└── Frontend/ (React + Vite)
    ├── src/api                     # axios clients
    ├── src/components              # charts, kaarten, tracker
    ├── src/hooks                   # tracking & profiel
    └── src/pages                   # quiz, explorer, dashboard
```

---

## 2. Belangrijkste flows

| Flow | Beschrijving |
| --- | --- |
| **Tracking layer** | `useInteractionTracker` logt clicks, hovers, focus/blurs, scroll depth, exit intent, idle events, drag/drop, copy, misclicks… alles wordt opgeschoond in `SanitizeInput` en opgeslagen in `interactions`. |
| **Profiel & nudging** | `UserProfileService` combineert antwoorden + gedrag. React toont banners, past volgorde van antwoorden/CTA’s aan, toont badges “Meest gekozen” en waarschuwingen wanneer een admin ingrijpt. |
| **Admin dashboard** | `/admin/overview` + `/admin/users/{uid}` geven statistieken, filters (daterange/device), detailtabellen (sessies, interacties, antwoorden, vergelijkingen) en een historiek van admin-acties. |
| **Vergelijkingen** | Explorer laat gebruikers parfums selecteren en een winnaar aanduiden. Deze data voedt het dashboard en kan door een admin beslist/gemanaged worden. |

---

## 3. Opschoning & datakwaliteit

- Middleware `SanitizeInput` trimt en normaliseert elke niet-GET payload.
- `InteractionController` bewaart enkel veilige metadata (max 25 keys, beperkte lengte).
- Artisan `sessions:close-stale` sluit sessies die langer dan X minuten openstaan en draait elk uur via de scheduler.
  ```bash
  docker compose exec backend php artisan sessions:close-stale --timeout=60
  ```

---

## 4. Docker services

| Service | Beschrijving |
| --- | --- |
| `db` | MySQL 8 met volume `db_data` |
| `phpmyadmin` | Webinterface op poort 8081 |
| `backend` | PHP 8.3 + Apache, gebruikt `.env` waarden |
| `frontend` | Node 22 Alpine, draait `npm run dev` |

Stoppen en opruimen:
```bash
docker compose down
docker compose down -v    # inclusief volumes
```

---

## 5. Tests & kwaliteit

- **PHPUnit**: `docker compose exec backend php artisan test`
- **Vitest (optioneel)**: `cd Frontend && npm test`
- Featuretest `CloseStaleSessionsTest` controleert het artisan-commando; bijkomende tests volgen voor AdminAnalytics en tracker.
- Werk via feature branches (`feature/...`) met conventionele commitberichten (`feat:`, `fix:`, `chore:`).

---

## 6. Extra hulp

- `Backend/.env.example` bevat de exacte docker-credentials.
- Scheduler manueel triggeren: `docker compose exec backend php artisan schedule:run`.
- Rapport + bronnen + AI-conversaties: zie [`docs/REPORT.md`](docs/REPORT.md). Inspiratie voor beeldmateriaal: Chanel, Dior, Byredo (vermeld in het rapport).

- **Demo data genereren** (optioneel):
  ```bash
  docker compose exec backend php artisan demo:seed --count=5
  ```
