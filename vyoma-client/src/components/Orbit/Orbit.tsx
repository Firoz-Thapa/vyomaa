import React from 'react';
import './Orbit.css';
import GlobeCanvas from './GlobeCanvas';
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
  highlighted?: boolean;
}

function SatelliteItem({
  id,
  name,
  lat,
  lng,
  alt,
  velocity,
  highlighted = false,
}: SatelliteItemProps): React.JSX.Element {
  return (
    <div
      className={`satellite-item${highlighted ? ' highlighted' : ''}`}
      title={`ID: ${id}`}
    >
      <div className="satellite-main">
        <span className="satellite-dot" aria-hidden="true" />
        <div className="satellite-copy">
          <div className="satellite-name">{name}</div>
          <div className="satellite-meta">
            {lat.toFixed(2)}°, {lng.toFixed(2)}°
          </div>
        </div>
      </div>

      <div className="satellite-info">
        <span className="pill">Alt: {alt.toFixed(0)} km</span>
        <span className="pill subtle">V: {velocity.toFixed(2)} km/s</span>
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

  const displayLimit = 6;
  const visiblePositions = positions.slice(0, displayLimit);
  const hiddenCount = Math.max(0, positions.length - displayLimit);

  const activeSatellite = visiblePositions[0];

  return (
    <section className="orbit-section" id="satellites">
      <div className="orbit-visual">
        <GlobeCanvas positions={positions} />
      </div>
      <div className="orbit-info">
        <div className="section-tag">Technology</div>
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

        <div className="satellite-tracking">
          <div className="tracking-header">
            <div className="tracking-title-group">
              <span className="tracking-badge">Live tracking</span>
              <h3>Starlink coverage</h3>
            </div>
            <button type="button" className="tracking-action">
              Create sub-issue
            </button>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-message">Loading satellite data...</div>
          ) : (
            <>
              <div className="tracking-summary">
                <div className="summary-card">
                  <span className="summary-label">Visible</span>
                  <strong>{positions.length}</strong>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Total</span>
                  <strong>{totalCount}</strong>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Updated</span>
                  <strong>{lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}</strong>
                </div>
              </div>

              <div className="tracking-focus">
                <div className="focus-avatar" aria-hidden="true">
                  {activeSatellite ? activeSatellite.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="focus-label">Closest pass</div>
                  <div className="focus-name">
                    {activeSatellite ? activeSatellite.name : 'Awaiting signal'}
                  </div>
                </div>
              </div>

              <div className="satellites-list">
                {visiblePositions.map((sat, index) => (
                  <SatelliteItem
                    key={sat.id}
                    {...sat}
                    highlighted={index === 0}
                  />
                ))}
              </div>

              {hiddenCount > 0 && (
                <div className="more-satellites">
                  +{hiddenCount} more satellites in this orbital window
                </div>
              )}

              {lastTleRefresh && (
                <div className="refresh-info">
                  TLE refreshed: {lastTleRefresh.toLocaleTimeString()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
