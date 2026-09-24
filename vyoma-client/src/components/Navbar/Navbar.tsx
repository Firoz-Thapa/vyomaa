import './Navbar.css';

type NavbarProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>VYOMA</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#api">API</a></li>
        <li><a href="#satellites">Satellites</a></li>
        <li><a href="#docs">Docs</a></li>
      </ul>

      <div className="navbar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button className="navbar-cta">Launch App</button>
      </div>
    </nav>
  );
}
