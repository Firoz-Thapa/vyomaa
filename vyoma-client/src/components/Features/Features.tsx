import './Features.css';

const FEATURES = [
  {
    name: 'Live Tracking',
    desc: 'Real-time positions updated every 5 seconds using TLE orbital data from CelesTrak.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke="#00d4ff" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="10" stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="2 2"/>
        <circle cx="14" cy="14" r="13" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4"/>
        <circle cx="14" cy="4" r="2" fill="#00d4ff"/>
      </svg>
    ),
  },
  {
    name: 'Pass Prediction',
    desc: 'Precise AOS/LOS times and max elevation for any location on Earth, days in advance.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M4 20L14 8L24 20" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 14L14 8L19 14" stroke="#00ff88" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="14" cy="8" r="2.5" fill="#00ff88"/>
      </svg>
    ),
  },
  {
    name: 'Telemetry Charts',
    desc: 'Visualize orbital history, elevation curves, and signal strength over time.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <rect x="3" y="8" width="22" height="14" rx="2" stroke="#ff6b35" strokeWidth="1.5"/>
        <path d="M3 12h22" stroke="#ff6b35" strokeWidth="0.8"/>
        <path d="M8 16h4M8 19h8" stroke="#ff6b35" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Email Alerts',
    desc: 'Get notified when a tracked satellite is about to pass over your saved location.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="6" stroke="#00d4ff" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="2" fill="#00d4ff"/>
      </svg>
    ),
  },
  {
    name: 'Pass History',
    desc: 'Full PostgreSQL-backed history of every pass over your locations, queryable via REST API.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <rect x="6" y="4" width="16" height="20" rx="2" stroke="#00ff88" strokeWidth="1.5"/>
        <path d="M10 9h8M10 13h8M10 17h5" stroke="#00ff88" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'User Accounts',
    desc: 'Secure JWT auth. Save custom locations, favorite satellites, manage alert preferences.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="4" stroke="#00d4ff" strokeWidth="1.5"/>
        <path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="features-inner">
        <div className="features-left">
          <div className="section-tag">Core capabilities</div>
          <h2 className="section-title">Mission-grade<br/>satellite ops</h2>
          <p className="section-sub">
            Real-time orbital mechanics powered by SGP4 propagation. Know exactly
            where every satellite is, and when it's coming your way.
          </p>
        </div>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div className="feat-card" key={f.name}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-name">{f.name}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
