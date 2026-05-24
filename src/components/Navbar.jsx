import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, logout, dark, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo" onClick={close}>
        vinss<span className="dot">-store.</span>
      </Link>

      {/* Desktop */}
      <div className="navbar-right desktop-nav">
        <Link
          to="/create"
          className={`nav-upload ${location.pathname === "/create" ? "nav-link-active" : ""}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Upload
        </Link>

        <button className="theme-btn" onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "nav-link-active" : ""}`}>
              Dashboard
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "nav-link-active" : ""}`}>
            Login
          </Link>
        )}
      </div>

      {/* Mobile */}
      <div className="mobile-nav-right">
        <button className="theme-btn" onClick={toggleDark}>{dark ? "☀️" : "🌙"}</button>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/create" className="mobile-menu-item" onClick={close}>+ Upload Snippet</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-menu-item" onClick={close}>Dashboard</Link>
              <button className="mobile-menu-item mobile-menu-btn" onClick={() => { logout(); close(); }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-menu-item" onClick={close}>Login</Link>
          )}
        </div>
      )}

    </nav>
  );
}

export default Navbar;
