# Weapon of Math Destruction – Rapport

## 1. Doel
Parfum Advisor verzamelt zoveel mogelijk gebruikersinteracties om een gedragsprofiel te bouwen. Dat profiel beïnvloedt het quizverloop, de getoonde aanbevelingen en admin-beslissingen. Dit document beschrijft de datastroom, de voornaamste biases en de gebruikte bronnen.

## 2. Datapijplijn
1. **Frontend (React)** – hooks `useInteractionTracker`, `useUserProfile`, pagina’s Home/Questionnaire/Explorer/Results/Dashboard.
2. **API (Laravel)** – controllers `UserController`, `SessionController`, `AnswerController`, `InteractionController`, `ProfileController`, `AdminAnalyticsController`, `AdminUserActionController`.
3. **Database (MySQL via Docker)** – tabellen `users`, `user_sessions`, `user_answers`, `interactions`, `user_profiles`, `comparisons`, `admin_user_actions`.
4. **Admin dashboard** – overzichtsstatistieken + detailper gebruiker (sessies, interacties, antwoorden, vergelijkingen, acties) met filters en exportmogelijkheden (te bouwen).

Elke interactie bevat o.a. `uid`, event_type, CTA/component metadata, route, viewport, device-agent, tijdstempels. `SanitizeInput` trimt en plaatst limieten zodat er geen onbetrouwbare payloads binnenkomen.

## 3. Profilering & invloed
- **Profielberekening** (`UserProfileService`) combineert antwoorden, gemiddelde antwoordtijd, engagement en abandon-rate tot een score + segment (`luxury_high_spender`, `premium_target`, `engaged_mid`, `low_attention`).
- **Nudging in de UI**:
  - Herordenen van budgetantwoorden, badges “Meest gekozen” gebaseerd op echte stats.
  - Banners op Home/Questionnaire/Results tonen een andere boodschap afhankelijk van segment en admin-acties (flag/promo).
  - CTA’s wisselen van volgorde (bij promotie wordt “Ontdekken” eerst getoond).
  - Explorer logt extra interacties zodat admin kan opvolgen wie handmatig vergelijkt.
  - Admin kan via dashboard acties registreren; die worden teruggekoppeld naar de gebruikerservaring.

## 4. Bias en kwetsbaarheden
| Risico | Beschrijving | Mogelijk gevolg |
| --- | --- | --- |
| **Beperkte steekproef** | Alleen gebruikers die de quiz instappen voeden de statistieken. Geen externe validatie. | “Meest gekozen”-badge kan gedrag sturen op basis van weinig datapoints. |
| **Shared devices** | UID zit in `localStorage`; meerdere personen op hetzelfde toestel delen dus profiel. | Onbetrouwbare segmenten, verkeerde nudges. |
| **Abandonment** | Onvolledige sessies bevatten toch antwoorddata. | Profiel en aanbevelingen kunnen vertekend raken. |
| **Manipuleerbaarheid** | Een gebruiker kan expres veel klikken/hoveren om CTA-statistieken te beïnvloeden. | Dashboard suggereert verkeerde hotspots, nudge stuurt verkeer fout. |
| **Privacyperceptie** | Tracking van scroll, idle, misclick, drag-drop voelt voor sommigen te invasief. | Kans op vertrouwenverlies of non-compliance (geen opt-out). |
| **Geen drempel voor badges** | Zelfs met weinig antwoorden wordt het meest gekozen antwoord getoond. | Social proof-effect op dunne data. |

### Mitigaties / werkpunten
- `sessions:close-stale` voorkomt eindeloze sessies en markeert onvoltooide quizzen.
- Dashboard toont filters zodat admin outliers kan negeren; toekomstige versies kunnen drempels toevoegen (bv. badge pas na 10 antwoorden).
- Alle data wordt getrimd en gevalideerd; metadata is begrensd tot 25 keys.
- TODO: API voor export + automatische detectie van verdachte activiteit (ex. herhaalde misclicks).
- TODO: optionele consent- of “stealth mode”-banner voor tracking.

## 5. Tests & cleaning
- **Middleware**: `SanitizeInput`.
- **Commando’s**: `sessions:close-stale`, gepland via scheduler; `demo:seed` (to come).
- **Tests**: `CloseStaleSessionsTest` + geplande tests voor `AdminAnalyticsController` en frontend (Vitest) voor tracker/nudges.
- **Geen mockdata**: seeders bevatten enkel vaste vragen/parfums. Analytics ontstaan door echte sessies of optionele demoseed.

## 6. Bronnen & tools
- Frameworks: Laravel 12, React 18/Vite, MySQL 8, Axios.
- UI-inspiratie en fotografie: Chanel, Dior, Byredo (voor beeldmateriaal en copy).
- AI-assistentie: ChatGPT (OpenAI) voor ideevorming, tekstuele feedback en codevoorstellen; alle output werd herzien en geïntegreerd met eigen logica.
- Verder gebruikt: officiële documentatie van Laravel/React/Vite, OWASP-cheatsheets voor input sanitizing.
