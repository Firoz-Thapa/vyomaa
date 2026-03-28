import './Orbit.css';

const TECH_TAGS = [
  'ASP.NET Core 10', 'React 19', 'TypeScript', 'PostgreSQL',
  'EF Core 10', 'Leaflet.js', 'SGP4', 'Docker', 'GitHub Actions', 'Azure',
];

export default function Orbit() {
  return (
    <div className="orbit-section">
      <div className="orbit-visual">
        <div className="orbit-ring r4" />
        <div className="orbit-ring r3"><div className="orbit-dot d3" /></div>
        <div className="orbit-ring r2"><div className="orbit-dot d2" /></div>
        <div className="orbit-ring r1"><div className="orbit-dot d1" /></div>
        <div className="orbit-center" />
      </div>
      <div className="orbit-info">
        <div className="section-tag">Technology</div>
        <h2>Production-grade<br/>full stack</h2>
        <p>
          Built with modern, enterprise-proven technologies. The same stack that
          powers real-world satellite operations software.
        </p>
        <div className="tech-tags">
          {TECH_TAGS.map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}
