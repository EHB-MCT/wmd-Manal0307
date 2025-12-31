# 🧴 Parfum Advisor

Weapon of Math Destruction project dat iedere interactie bijhoudt, gebruikers segmenteert en het admin dashboard realtime voedt – zonder mockdata.

---

## 0. Start & lokale setup

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
3. **Urls**
   - Quiz + tracking frontend: `http://localhost:5174`
   - Admin dashboard: `http://localhost:5174/dashboard`
   - Backend API: `http://localhost:8080`
   - phpMyAdmin: `http://localhost:8081`

> Vite vraagt Node.js ≥ 20.19. Versies daaronder geven enkel een waarschuwing.

Alle statistieken, grafieken en tabellen halen hun data rechtstreeks uit MySQL. Seeders leveren enkel vaste entities (vragen, parfums). Sessions, answers, interactions, profiles, comparisons … worden enkel aangemaakt door echte gebruikersacties.

---

## 1. Structuur

```
wmd-Manal0307/
├── docker-compose.yml
├── Backend/ (Laravel 12)
│   ├── app/
│   │   ├── Console/Commands        # bv. sessions:close-stale
│   │   ├── Http/Controllers        # API endpoints
│   │   ├── Http/Middleware         # Sanitizing & tracking filters
│   │   └── Models/Services         # User, Session, Profile, …
│   ├── database/
│   │   ├── migrations              # tabellen voor analytics
│   │   └── seeders                 # parfums, vragen
│   └── routes/api.php              # REST API
└── Frontend/ (React + Vite)
    ├── src/api                     # axios clients
    ├── src/components              # charts, cards, tracker
    ├── src/hooks                   # tracking & profile hooks
    └── src/pages                   # quiz, explorer, dashboard
```

---

## 2. Belangrijkste flows

| Flow | Beschrijving |
| --- | --- |
| **Tracking layer** | `useInteractionTracker` logt clicks, hovers, focus/blurs, scroll depth, exit intent, idle events, drag/drop, copy enz. Data wordt opgeschoond (max lengtes, strip tags) en opgeslagen in `interactions`. |
| **Profiel & nudging** | Antwoorden + gedrag voeden `user_profiles` via `UserProfileService`. React toont banners, hersorteert keuzes en highlight CTAs op basis van segment. |
| **Admin dashboard** | `/admin/overview` + `/admin/users/{uid}` leveren de cijfers. Users tab bevat search, filters (datum/device), detailpanelen met sessies, interacties, antwoorden en vergelijkingen. Alles toont live data. |
| **Vergelijkingen** | Gebruikers selecteren parfums, duiden een winnaar aan en sturen het naar `/comparisons`. Deze events verschijnen in het dashboard en kunnen beheerd worden. |

---

## 3. Sanitizing & datakwaliteit

- Middleware `SanitizeInput` trimt en normaliseert alle niet-GET payloads.
- `InteractionController` beperkt metadata tot veilige, korte key/value-paren.
- Artisan command `sessions:close-stale` sluit sessies die langer dan X minuten open staan.
  ```bash
  docker compose exec backend php artisan sessions:close-stale --timeout=60
  ```
- Scheduler (`routes/console.php`) draait het commando elk uur automatisch.

---

## 4. Docker services

| Service | Beschrijving |
| --- | --- |
| `db` | MySQL 8 met volume `db_data` |
| `phpmyadmin` | UI op poort 8081 |
| `backend` | PHP 8.3 + Apache, laadt `.env` waarden van hierboven |
| `frontend` | Node 22 Alpine, draait `npm run dev` |

Stoppen en opruimen:
```bash
docker compose down
docker compose down -v    # inclusief volumes
```

---

## 5. Testing & kwaliteitsbewaking

- **PHPUnit**: `docker compose exec backend php artisan test`
- **Vitest (optioneel)**: `cd Frontend && npm test`
- Feature test `CloseStaleSessionsTest` zorgt dat het artisan commando correcte sessies afsluit.
- Gebruik feature branches (`feature/...`) + conventionele commits (`feat:`, `fix:`, `chore:`).

---

## 6. Extra hulpmiddelen

- `Backend/.env.example` bevat exacte docker credentials.
- `docker compose exec backend php artisan schedule:run` kan gebruikt worden om de scheduler manueel te triggeren.
- Bronvermeldingen & AI-conversaties documenteren in je eindrapport (WMD-vereiste).

Succes! Verzamel zoveel mogelijk data, analyseer het ethisch en beschrijf de beperkingen in het finale verslag.***
