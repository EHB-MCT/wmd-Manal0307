# 🧴 Parfum Advisor – Standards

## 1. Code style & structuur

- **Programmeertalen**: PHP (Laravel) voor backend, JavaScript (React) voor frontend.  
- **Indentatie**: 2 spaties per niveau.  
- **Lijnlengte**: max. 100 tekens per regel.  
- **Commentaar**: korte, duidelijke beschrijving boven complexe functies of controllers.  
- **Variabelnamen**:  
  - camelCase voor JavaScript (`fetchData()`, `topBrandsChart`).  
  - snake_case voor PHP-variabelen en databasevelden (`total_sales`, `brand_name`).  
- **Bestandsnamen**: Engels, zonder spaties of accenten (`StatsController.php`, `chartsService.js`).  
- **Componentnamen (React)**: PascalCase (`SalesChart`, `KpiCard`, `DashboardPage`).  
- **Code standaarden**:  
  - **PHP** volgt [PSR-12](https://www.php-fig.org/psr/psr-12/) conventies.  
  - **React** volgt Airbnb JavaScript Style Guide.  

---

## 2. Bestandsstructuur

### 📁 Project root
parfum-advisor/
├── docker-compose.yml → definieert alle containers (backend, frontend, database)
├── backend/ → Laravel-app (PHP)
│ ├── app/Http/Controllers → API-controllers (logica & berekeningen)
│ ├── routes/api.php → definities van alle API-routes
│ ├── database/
│ │ ├── migrations/ → structuur van de MySQL-tabellen
│ │ └── seeders/ → fakedata (testverkoopgegevens)
│ ├── public/ → toegankelijke backendmap
│ └── .env → configuratie van DB (nooit gecommit)
│
├── frontend/ → React-dashboard
│ ├── src/
│ │ ├── components/ → herbruikbare UI-elementen (grafieken, kaarten)
│ │ ├── pages/ → schermen (Dashboard, Overzicht)
│ │ ├── datas/ → API-calls (axios/fetch)
│ │ └── App.jsx → hoofdcomponent
│ └── package.json → npm dependencies
│
├── README.md → projectdocumentatie
└── standards.md → code & ontwikkelstandaarden


---

## 3. Git & versiebeheer

- **Branching**:
  - `main` → stabiele versie  
  - `dev` → actieve ontwikkelbranch  
  - `feature/...` → nieuwe functies (bv. `feature/top-notes-chart`)  

---

## 4. Backend & database standaarden

### 🔹 Backend (Laravel / PHP)
- Alle API-routes worden gedefinieerd in `routes/api.php`.  
- Controllers volgen **Single Responsibility Principle** (één taak per controller).  
- Eloquent ORM wordt gebruikt voor databasequeries (`Product::where('brand', 'Chanel')`).  
- API-responses in **JSON-formaat**, altijd met duidelijke keys (`status`, `data`, `message`).  
- Foutafhandeling via Laravel’s standaard `Exception Handler`.  
  

### 🔹 Database (MySQL)
- Tabelnamen in meervoud: `clients`, `products`, `sales`.  
- Primaire sleutels als `id` (INT, AUTO_INCREMENT).  
- Vreemde sleutels:
  - `client_id` → verwijst naar `clients.id`  
  - `product_id` → verwijst naar `products.id`  
- Kolomnamen in snake_case (`brand_name`, `total_sales`).  
- Datatypes:
  - `VARCHAR(255)` voor tekst  
  - `DECIMAL(10,2)` voor prijzen  
  - `INT` voor hoeveelheden en ID’s  
  - `DATE` voor verkoopdatum  
- Seeder (`database/seeders/DatabaseSeeder.php`) genereert testdata (fakedata van parfums).  

---

## 5. Frontend standaarden (React + Chart.js)
- Componenten zijn modulair en herbruikbaar.  
- Data wordt opgehaald via `datas/api.js` (fetch of axios).  
- State management met **React Hooks** (`useState`, `useEffect`).  
- Grafieken gemaakt met **Chart.js**:   
- Fouten in API-calls worden visueel afgehandeld met eenvoudige foutmeldingen.  
- CSS Tailwind

---

## 6. Docker & omgeving
- Alle services worden beheerd via **Docker Compose**.  
- `docker-compose.yml` bevat:
  - `backend` → PHP + Laravel + Apache  
  - `frontend` → React  
  - `db` → MySQL 8 met volume  
  - `phpmyadmin` → databasebeheer op poort 8081  
- **Voorbeeld van starten:**
  ```bash
  docker-compose up -d

