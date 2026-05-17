import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const next = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(next);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) { /* ignore */ }
    setTheme(next);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = {
    color: "var(--nav-text)",
    textDecoration: "none",
    fontSize: "0.9375rem",
    fontWeight: 500,
    padding: "6px 0",
    borderBottom: "1px solid transparent",
    transition: "border-color 0.2s, color 0.2s, opacity 0.2s",
    opacity: 0.85,
  };

  const onHover = (e) => {
    e.currentTarget.style.borderBottomColor = "var(--highlight)";
    e.currentTarget.style.opacity = "1";
  };
  const onLeave = (e) => {
    e.currentTarget.style.borderBottomColor = "transparent";
    e.currentTarget.style.opacity = "0.85";
  };

  const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
  const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <nav
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-line)",
        padding: "18px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        color: "var(--nav-text)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Wordmark — no flex gap so 'C' and 'ampusNest' join */}
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.5rem",
            letterSpacing: "-0.01em",
            color: "var(--nav-text)",
            textDecoration: "none",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontStyle: "italic",
              color: "var(--highlight)",
              fontWeight: 600,
            }}
          >
            C
          </span>
          <span>ampus</span>
          <span style={{ fontWeight: 400 }}>Nest</span>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link to="/listings" style={linkStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>
            Listings
          </Link>

          {user ? (
            <>
              {user.role === "owner" && (
                <Link to="/owner-dashboard" style={linkStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>
                  Dashboard
                </Link>
              )}
              {user.role === "student" && (
                <>
                  <Link to="/my-reservations" style={linkStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>
                    Reservations
                  </Link>
                  <Link to="/my-wishlist" style={linkStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>
                    Wishlist
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  style={{ ...linkStyle, color: "var(--highlight)", fontWeight: 600, opacity: 1 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "var(--highlight)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; }}
                >
                  Admin
                </Link>
              )}

              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--nav-text)",
                  opacity: 0.7,
                  fontStyle: "italic",
                  fontFamily: "var(--font-display)",
                  borderLeft: "1px solid var(--nav-line)",
                  paddingLeft: "20px",
                }}
              >
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  ...linkStyle,
                  background: "transparent",
                  border: "1px solid var(--nav-line)",
                  padding: "6px 14px",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--highlight)";
                  e.currentTarget.style.borderColor = "var(--highlight)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--nav-line)";
                  e.currentTarget.style.opacity = "0.85";
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onMouseEnter={onHover} onMouseLeave={onLeave}>
                Sign in
              </Link>
              <Link
                to="/register"
                style={{
                  background: "var(--highlight)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--highlight-deep)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--highlight)")}
              >
                Get started
              </Link>
            </>
          )}

          {/* Theme toggle — always last on the right */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "transparent",
              border: "1px solid var(--nav-line)",
              color: "var(--nav-text)",
              padding: "8px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s, transform 0.15s",
              opacity: 0.85,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--highlight)";
              e.currentTarget.style.borderColor = "var(--highlight)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--nav-line)";
              e.currentTarget.style.color = "var(--nav-text)";
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
