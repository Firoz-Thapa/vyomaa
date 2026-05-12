import './Docs.css';

const DOC_SECTIONS = [
  {
    title: 'Quick Start',
    items: [
      'Choose a satellite group from the live catalog.',
      'Set an observer latitude, longitude, and prediction window.',
      'Review live positions, pass windows, and alert-ready events.',
    ],
  },
  {
    title: 'Data Pipeline',
    items: [
      'TLE data is fetched from CelesTrak and refreshed on a schedule.',
      'SGP4 propagation converts orbital elements into current positions.',
      'Computed tracks power the globe, API responses, and pass predictions.',
    ],
  },
  {
    title: 'Core Endpoints',
    items: [
      'GET /api/satellites returns active catalog records.',
      'GET /api/satellites/{noradId}/position returns a propagated position.',
      'GET /api/passes/predict returns AOS, LOS, and max elevation events.',
    ],
  },
];

export default function Docs() {
  return (
    <section className="docs-section" id="docs" aria-labelledby="docs-title">
      <div className="docs-inner">
        <div className="docs-intro">
          <div className="section-tag">Documentation</div>
          <h2 id="docs-title">Build against SkyGrid without guesswork</h2>
          <p>
            Start with the live satellite catalog, propagate positions with the
            same SGP4 flow used by the dashboard, then query pass predictions
            for any ground location.
          </p>
          <div className="docs-actions">
            <a className="docs-primary-link" href="#api">View API examples</a>
            <a className="docs-secondary-link" href="#satellites">Inspect live satellites</a>
          </div>
        </div>

        <div className="docs-content">
          {DOC_SECTIONS.map((section) => (
            <article className="docs-block" key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
