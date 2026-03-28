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
          Ground station dashboard for real-time satellite tracking, pass prediction,
          and orbital telemetry. Built for engineers, researchers, and space enthusiasts.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Open Dashboard</button>
          <button className="btn-ghost">View API Docs</button>
        </div>
      </section>
    </>
  );
}
