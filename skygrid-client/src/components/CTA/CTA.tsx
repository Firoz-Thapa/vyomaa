import './CTA.css';

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-grid-bg" />
      <div className="section-tag">Open source</div>
      <h2>Track the sky. <span className="cta-accent">Own the code.</span></h2>
      <p>SkyGrid is fully open source. Star it on GitHub and follow the build.</p>
      <div className="cta-actions">
        <button className="btn-primary">Open Dashboard</button>
        <button className="btn-ghost">GitHub →</button>
      </div>
    </section>
  );
}
