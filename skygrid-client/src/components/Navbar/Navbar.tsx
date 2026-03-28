import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Sky<span>Grid</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#api">API</a></li>
        <li><a href="#satellites">Satellites</a></li>
        <li><a href="#docs">Docs</a></li>
      </ul>
      <button className="navbar-cta">Launch App</button>
    </nav>
  );
}
