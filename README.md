# SkyGrid - Real-Time Satellite Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![.NET](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

SkyGrid is a comprehensive satellite tracking and orbital intelligence platform that provides real-time monitoring and analysis of satellite operations. Built for aerospace engineers, researchers, and space enthusiasts, SkyGrid democratizes access to satellite data with advanced orbital mechanics algorithms.

![SkyGrid Dashboard](https://via.placeholder.com/800x400/1a1a2e/00d4ff?text=SkyGrid+Dashboard)

## Features

- **Real-Time Satellite Tracking**: Live position updates for 8,000+ active satellites using SGP4 propagation
- **Pass Predictions**: Accurate satellite visibility windows for any location on Earth
- **Orbital Intelligence**: Advanced trajectory calculations and orbital mechanics
- **Ground Station Management**: Multi-location support for worldwide satellite operations
- **REST API**: Clean, documented endpoints for satellite data and predictions
- **Interactive Dashboard**: Modern React-based UI with real-time visualizations
- **Open Source**: Fully open source with community contributions welcome

## Tech Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **satellite.js** - SGP4 orbital propagation library

### Backend
- **ASP.NET Core 10** - High-performance web framework
- **Entity Framework Core 10** - Modern ORM for .NET
- **PostgreSQL** - Robust relational database
- **REST API** - Clean HTTP API design

### Data Sources
- **CelesTrak API** - Official source for Two-Line Element (TLE) data
- **SGP4 Algorithm** - Standard orbital propagation model

## Prerequisites

- **.NET 10.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 13+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skygrid.git
cd skygrid
```

### 2. Backend Setup

```bash
# Navigate to API project
cd SkyGrid.API

# Restore NuGet packages
dotnet restore

# Update database connection string in appsettings.json
# Default connection: "Host=localhost;Database=skygrid;Username=postgres;Password=yourpassword"

# Run database migrations
dotnet ef database update

# Start the API server
dotnet run
```

The API will be available at `https://localhost:5001` (HTTPS) and `http://localhost:5000` (HTTP).

### 3. Frontend Setup

```bash
# Navigate to client project
cd ../skygrid-client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Usage

### Dashboard
1. Open your browser and navigate to `http://localhost:5173`
2. View real-time satellite positions on the interactive map
3. Monitor orbital statistics and system health
4. Access satellite details and pass predictions

### API Endpoints

#### Get All Satellites
```http
GET /api/satellites
```

#### Get Satellite by NORAD ID
```http
GET /api/satellites/{noradId}
```

#### Get Live Satellite Position
```http
GET /api/satellites/{noradId}/position
```

#### Predict Satellite Passes
```http
GET /api/passes/predict?lat={latitude}&lng={longitude}&hours={hours}
```

#### Get Ground Stations
```http
GET /api/locations
```

### Example API Response

```json
{
  "noradId": 25544,
  "name": "ISS (ZARYA)",
  "latitude": 61.23,
  "longitude": 25.41,
  "altitudeKm": 408.3,
  "velocityKms": 7.66
}
```

## Architecture

```
SkyGrid/
├── skygrid-client/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and satellite services
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
├── SkyGrid.API/            # ASP.NET Core backend
│   ├── Controllers/        # API controllers
│   ├── Models/            # Entity models
│   ├── Data/              # Database context and DTOs
│   └── Services/          # Business logic services
└── SkyGrid.slnx           # Solution file
```

## Development

### Running Tests

```bash
# Backend tests
cd SkyGrid.API
dotnet test

# Frontend tests
cd skygrid-client
npm test
```

### Building for Production

```bash
# Build backend
cd SkyGrid.API
dotnet publish -c Release

# Build frontend
cd skygrid-client
npm run build
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## Data Sources

SkyGrid uses the following data sources:

- **CelesTrak**: Primary source for Two-Line Element (TLE) data
- **NORAD**: Satellite catalog and identification numbers
- **Space-Track.org**: Additional orbital data (optional)

The system includes intelligent fallbacks for API outages and provides mock data for development.

## Security

- API endpoints include CORS configuration for frontend access
- Input validation on all API endpoints
- Secure database connections with connection string encryption
- Regular dependency updates for security patches

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **CelesTrak** for providing satellite TLE data
- **satellite.js** library for SGP4 implementation
- **NASA** and **NORAD** for orbital data standards
- Open source community for amazing tools and libraries

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/skygrid/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/skygrid/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/skygrid/wiki)

---

**Built with ❤️ for the space community**

*Track the sky. Own the code.*</content>
<parameter name="filePath">c:\Users\Gyawa\projects\SkyGrid\README.md