import { useStarfield } from './UserStarfiled';
import './Hero.css';

export default function Hero() {
  const canvasRef = useStarfield();

  return (
    <>
      <canvas ref={canvasRef} className="starfield" />
      <section className="hero">
        <div className="hero-tag">Real-time satellite intelligence</div>
        <h1>
          <span className="line1">Track Every</span>
          <span className="line2">Orbit.</span>
        </h1>
        <p className="hero-sub">
          Comprehensive ground station dashboard providing real-time satellite tracking, precise pass predictions,
          and advanced orbital telemetry. Powered by SGP4 algorithms and CelesTrak data, Vyoma delivers mission-critical
          intelligence for engineers, researchers, and space operations teams worldwide. Monitor over 8,000 active satellites
          with sub-second accuracy and automated alerting systems.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Open Dashboard</button>
          <a className="btn-ghost" href="#docs">View API Docs</a>
        </div>
      </section>
    </>
  );
}
