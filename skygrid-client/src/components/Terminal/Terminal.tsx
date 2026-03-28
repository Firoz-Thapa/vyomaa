import './Terminal.css';

export default function Terminal() {
  return (
    <section className="terminal-section" id="api">
      <div className="terminal-header">
        <div className="section-tag">REST API</div>
        <h2>Clean, documented endpoints</h2>
      </div>
      <div className="terminal">
        <div className="term-bar">
          <div className="term-dot td1" />
          <div className="term-dot td2" />
          <div className="term-dot td3" />
          <span className="term-title">SkyGrid API — v1.0</span>
        </div>
        <div className="term-body">
          <p className="term-line tc-muted">{'// Get all active satellites'}</p>
          <p className="term-line"><span className="tc-green">GET</span> <span className="tc-blue">/api/satellites</span></p>

          <p className="term-line tc-muted" style={{ marginTop: '1rem' }}>{'// Predict passes for a location'}</p>
          <p className="term-line">
            <span className="tc-green">GET</span>{' '}
            <span className="tc-blue">/api/passes/predict</span>
            <span className="tc-muted">?lat=60.97&lng=25.66&hours=24</span>
          </p>

          <p className="term-line tc-muted" style={{ marginTop: '1rem' }}>{'// Live position of a satellite'}</p>
          <p className="term-line">
            <span className="tc-green">GET</span>{' '}
            <span className="tc-blue">/api/satellites/</span>
            <span className="tc-orange">25544</span>
            <span className="tc-blue">/position</span>
          </p>

          <p className="term-line tc-muted" style={{ marginTop: '1rem' }}>{'// Response'}</p>
          <p className="term-line tc-muted">{'{'}</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"noradId"</span>: <span className="tc-orange">25544</span>,</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"name"</span>: <span className="tc-green">"ISS (ZARYA)"</span>,</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"latitude"</span>: <span className="tc-orange">61.23</span>,</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"longitude"</span>: <span className="tc-orange">25.41</span>,</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"altitudeKm"</span>: <span className="tc-orange">408.3</span>,</p>
          <p className="term-line">&nbsp;&nbsp;<span className="tc-blue">"velocityKms"</span>: <span className="tc-orange">7.66</span></p>
          <p className="term-line"><span className="tc-muted">{'}'}</span> <span className="cursor" /></p>
        </div>
      </div>
    </section>
  );
}
