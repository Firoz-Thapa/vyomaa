# Vyoma

Vyoma is a satellite tracking and orbital awareness application built with a React + TypeScript frontend and an ASP.NET Core backend. The project is focused on visualizing satellite motion, exploring pass predictions, and laying the foundation for a broader mission-aware tracking platform.

This repository is currently a full-stack prototype: the frontend delivers a polished landing experience and orbit-focused UI, while the backend provides a REST API for managing satellite records and data persistence.

## Current Status

The codebase is actively evolving, but the current implementation is best described as a working frontend prototype plus an API foundation. The product direction is clearly Vyoma, even though a few legacy SkyGrid names remain in older project and namespace references.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- satellite.js
- CSS-based component styling

### Backend

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Npgsql
- Serilog
- OpenAPI support in development mode

## Repository Structure

```text
Vyoma/
├── README.md
├── Vyoma.slnx
├── vyoma-client/                  # Vite + React frontend
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── styles/
├── vyoma.API/                     # ASP.NET Core API
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Program.cs
│   ├── appsettings.json
│   └── SkyGrid.API.csproj
└── .gitignore
```

Note: some legacy `SkyGrid` names still appear in the .NET project file and namespace references. The product identity and active repository structure are Vyoma-based, but those legacy names have not been fully cleaned up yet.

## Prerequisites

- .NET SDK compatible with the API project
- Node.js 18 or later
- PostgreSQL 13+
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Vyoma.git
cd Vyoma
```

### 2. Configure the backend

Update the PostgreSQL connection string in `vyoma.API/appsettings.json` or use local user secrets for development.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=vyoma;Username=postgres;Password=yourpassword;"
  }
}
```

Then run the API:

```bash
cd vyoma.API
dotnet restore
dotnet run
```

### 3. Start the frontend

```bash
cd vyoma-client
npm install
npm run start
```

The frontend is served by Vite, typically at:

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

## Current API Surface

The ASP.NET API currently exposes a small set of satellite endpoints.

### Get active satellites

```http
GET /api/satellites
```

Returns active satellite records ordered by name.

### Get a satellite by NORAD ID

```http
GET /api/satellites/{noradId}
```

Returns a single satellite entry if it exists.

### Create a satellite

```http
POST /api/satellites
Content-Type: application/json
```

Example payload:

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

The current front end uses orbital logic and TLE-driven data from CelesTrak in the browser:

```text
React app -> CelesTrak TLE data -> satellite.js -> orbital UI rendering
```

The backend currently persists satellite-related records in PostgreSQL and exposes them through the ASP.NET API. It does not yet fully centralize orbit prediction or live pass calculations as backend services.

## Feature Direction

The landing page and feature descriptions indicate the intended product scope:

- Live tracking
- Pass prediction
- Telemetry charts
- Email alerts
- Pass history
- User accounts

These are part of the product vision, but the current repo is still in a staged implementation where the frontend and API are being built out together.

## Recommended Next Steps

- Clean up remaining legacy `SkyGrid` naming in project and namespace references
- Add stronger backend validation for satellite records
- Introduce DTOs for POST request and response handling
- Add dedicated pass prediction and position endpoints
- Add CelesTrak sync and persistence strategy for TLE data
- Add automated tests for both frontend and backend
- Add CI workflow checks for build and lint validation

## Building for Production

### Backend

```bash
cd vyoma.API
dotnet publish -c Release
```

### Frontend

```bash
cd vyoma-client
npm run build
```

## Data Sources

- [CelesTrak](https://celestrak.org/) for public TLE data
- [satellite.js](https://github.com/shashwatak/satellite-js) for orbital propagation

## License

This repository does not currently include a license file. If you plan to publish or distribute the project, add a license before doing so.

---

Track the sky. Own the code.
