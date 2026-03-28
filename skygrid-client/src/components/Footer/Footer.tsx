import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">SkyGrid</div>
      <div className="footer-txt">
        Built with ASP.NET Core 10 + React — Firoz Thapa © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
