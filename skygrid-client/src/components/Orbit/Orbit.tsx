import React from 'react';
import './Orbit.css';
import { useLiveSatellites } from '../../hooks/useLiveSatellites';

const TECH_TAGS = [
  'ASP.NET Core 10', 'React 19', 'TypeScript', 'PostgreSQL',
  'EF Core 10', 'Leaflet.js', 'SGP4', 'Docker', 'GitHub Actions', 'Azure',
];

interface SatelliteItemProps {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
}

function SatelliteItem({
  id,
  name,
  lat,
  lng,
  alt,
  velocity,
}: SatelliteItemProps): React.JSX.Element {
  return (
    <div className="satellite-item" title={`ID: ${id}`}>
      <div className="satellite-name">{name}</div>
      <div className="satellite-coords">
        <span className="coord-label">Lat:</span> {lat.toFixed(2)}°
        <span className="coord-label">Lng:</span> {lng.toFixed(2)}°
      </div>
      <div className="satellite-info">
        <span className="alt">Alt: {alt.toFixed(0)} km</span>
        <span className="velocity">V: {velocity.toFixed(2)} km/s</span>
      </div>
    </div>
  );
}

export default function Orbit(): React.JSX.Element {
  const {
    positions,
    loading,
    error,
    totalCount,
    lastUpdate,
    lastTleRefresh,
  } = useLiveSatellites({
    group: 'starlink',
    updateIntervalMs: 5000,
    refreshTleAfterMs: 3600000,
  });

  const displayLimit = 10;
  const visiblePositions = positions.slice(0, displayLimit);
  const hiddenCount = Math.max(0, positions.length - displayLimit);

  return (
    <div className="orbit-section">
      <div className="orbit-visual">
        <div className="orbit-ring r4" />
        <div className="orbit-ring r3">
          <div className="orbit-dot d3" />
        </div>
        <div className="orbit-ring r2">
          <div className="orbit-dot d2" />
        </div>
        <div className="orbit-ring r1">
          <div className="orbit-dot d1" />
        </div>
        <div className="orbit-center" />
      </div>
      <div className="orbit-info">
        <div className="section-tag">Technology</div>
        <h2>
          Production-grade
          <br />
          full stack
        </h2>
        <p>
          Built with modern, enterprise-proven technologies. The same stack that
          powers real-world satellite operations software.
        </p>
        <div className="tech-tags">
          {TECH_TAGS.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        {/* Live Satellite Tracking Section */}
        <div className="satellite-tracking">
          <h3>Live Satellite Tracking (Starlink)</h3>

          {error && <div className="error-message">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-message">Loading satellite data...</div>
          ) : (
            <>
              <div className="tracking-stats">
                <div className="stat">
                  <span className="stat-label">Visible:</span>
                  <span className="stat-value">{positions.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{totalCount}</span>
                </div>
                {lastUpdate && (
                  <div className="stat">
                    <span className="stat-label">Updated:</span>
                    <span className="stat-value">
                      {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="satellites-list">
                {visiblePositions.map((sat) => (
                  <SatelliteItem key={sat.id} {...sat} />
                ))}
              </div>

              {hiddenCount > 0 && (
                <div className="more-satellites">
                  +{hiddenCount} more satellites
                </div>
              )}

              {lastTleRefresh && (
                <div className="refresh-info">
                  TLE data refreshed: {lastTleRefresh.toLocaleTimeString()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
