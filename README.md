# Vyoma

Vyoma is a satellite tracking web app built with a React/TypeScript frontend and an ASP.NET Core API. The current app presents a polished landing/dashboard experience with live satellite position visualization powered by CelesTrak TLE data and `satellite.js` propagation in the browser.

The backend currently provides a foundation for storing satellite, pass, location, and user data with Entity Framework Core and PostgreSQL.

## Current Features

- **Live satellite visualization** using CelesTrak TLE data and SGP4 propagation through `satellite.js`
- **Interactive globe canvas** with animated satellite markers
- **Satellite list and telemetry display** including latitude, longitude, altitude, and velocity
- **Fallback mock satellite data** when CelesTrak is unavailable during development
- **ASP.NET Core REST API** with satellite list, detail, and create endpoints
- **PostgreSQL persistence** through Entity Framework Core migrations
- **Modern React frontend** built with Vite and TypeScript

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- satellite.js
- CSS modules/files organized by component

### Backend

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Serilog
- OpenAPI in development

## Project Structure

```text
Vyoma/
|-- skygrid-client/              # React TypeScript frontend
|   |-- src/
|   |   |-- components/          # UI sections and visual components
|   |   |-- hooks/               # React hooks
|   |   |-- pages/               # Page composition
|   |   |-- services/            # CelesTrak + orbit propagation logic
|   |   `-- styles/              # Shared styling
|   |-- package.json
|   `-- vite.config.ts
|-- SkyGrid.API/                 # ASP.NET Core backend
|   |-- Controllers/             # API controllers
|   |-- Migrations/              # EF Core migrations
|   |-- Models/                  # Entity models and DbContext
|   |-- Program.cs
|   `-- SkyGrid.API.csproj
|-- README.md
`-- SkyGrid.slnx
```

## Prerequisites

- .NET SDK compatible with the API target framework
- Node.js 18+
- PostgreSQL 13+
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/skygrid.git
cd skygrid
```

### 2. Configure the backend

Update the PostgreSQL connection string in `SkyGrid.API/appsettings.json` or use user secrets for local development.

Example connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=skygrid;Username=postgres;Password=yourpassword"
  }
}
```

Then run the API:

```bash
cd SkyGrid.API
dotnet restore
dotnet ef database update
dotnet run
```

The API will use the ports configured in `SkyGrid.API/Properties/launchSettings.json`.

### 3. Run the frontend

```bash
cd skygrid-client
npm install
npm run start
```

The frontend is served by Vite, usually at:

```text
http://localhost:5173
```

## Available Frontend Scripts

```bash
npm run start     # Start the Vite dev server
npm run build     # Type-check and build for production
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

## Current API Endpoints

### Get active satellites

```http
GET /api/satellites
```

Returns active satellites ordered by name.

### Get satellite by NORAD ID

```http
GET /api/satellites/{noradId}
```

Returns a single satellite by NORAD catalog ID.

### Create satellite

```http
POST /api/satellites
Content-Type: application/json
```

Creates a new satellite record.

Example request:

```json
{
  "name": "ISS (ZARYA)",
  "noradId": 25544,
  "tleLine1": "1 25544U 98067A   24123.45678901  .00012345  00000+0  12345-3 0  9991",
  "tleLine2": "2 25544  51.6400 123.4567 0005000 123.4567 234.5678 15.50000000123456",
  "category": "stations",
  "isActive": true
}
```

## Data Flow

The frontend currently fetches satellite group data directly from CelesTrak:

```text
React app -> CelesTrak API -> satellite.js propagation -> globe/list UI
```

If CelesTrak is unavailable, the client falls back to generated mock data so the interface remains usable during development.

The backend currently stores satellite-related entities but does not yet proxy CelesTrak, calculate live positions, or expose pass prediction endpoints.

## Recommended Next Improvements

- Add backend CelesTrak sync and cache TLE data in PostgreSQL
- Add `/api/satellites/{noradId}/position`
- Add `/api/passes/predict`
- Add location CRUD endpoints
- Replace direct EF entity POST bodies with request/response DTOs
- Add validation and duplicate NORAD ID handling
- Add backend and frontend tests
- Add GitHub Actions for build, lint, and test checks
- Add a real dashboard screenshot to replace placeholder documentation imagery

## Building for Production

### Backend

```bash
cd SkyGrid.API
dotnet publish -c Release
```

### Frontend

```bash
cd skygrid-client
npm run build
```

## Data Sources

- [CelesTrak](https://celestrak.org/) for satellite TLE data
- [satellite.js](https://github.com/shashwatak/satellite-js) for orbital propagation

## License

This project is intended to be open source. Add a `LICENSE` file if you plan to publish or distribute it.

---

Track the sky. Own the code.
