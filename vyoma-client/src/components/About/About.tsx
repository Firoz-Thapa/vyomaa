import './About.css';

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-inner">
        <div className="about-content">
          <div className="section-tag">About Vyoma</div>
          <h2 className="section-title">Empowering Satellite Operations</h2>
          <p className="section-sub">
            Vyoma is a comprehensive platform designed for real-time satellite tracking and orbital intelligence.
            Built by aerospace engineers and software developers, our mission is to democratize access to satellite data
            for researchers, engineers, and space enthusiasts worldwide.
          </p>
          <p className="section-sub">
            Leveraging advanced orbital mechanics algorithms like SGP4 propagation, Vyoma provides accurate,
            real-time tracking of over 8,000 active satellites. Our platform offers pass predictions, telemetry
            visualization, and automated alerts to keep you informed about satellite activities.
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <span className="stat-num">10+</span>
              <span className="stat-label">Years of Experience</span>
            </div>
            <div className="about-stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Countries Served</span>
            </div>
            <div className="about-stat">
              <span className="stat-num">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
        <div className="about-image">
          {/* Placeholder for an image or illustration */}
          <div className="placeholder-image">Satellite Illustration</div>
        </div>
      </div>
    </section>
  );
}