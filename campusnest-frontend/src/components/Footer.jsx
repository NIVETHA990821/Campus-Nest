const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--nav-bg)",
        color: "var(--nav-text)",
        marginTop: "80px",
        padding: "56px 0 32px",
        borderTop: "1px solid var(--nav-line)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "40px",
            alignItems: "start",
            paddingBottom: "40px",
            borderBottom: "1px solid var(--nav-line)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "1.625rem",
                letterSpacing: "-0.01em",
                marginBottom: "10px",
                color: "var(--nav-text)",
              }}
            >
              <span style={{ fontStyle: "italic", color: "var(--highlight)", fontWeight: 600 }}>
                C
              </span>
              <span>ampus</span>
              <span style={{ fontWeight: 400 }}>Nest</span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "0.9375rem",
                color: "var(--nav-text)",
                opacity: 0.75,
                maxWidth: "440px",
                lineHeight: 1.5,
              }}
            >
              A directory of safe, affordable accommodation for university
              students across Sri Lanka.
            </p>
          </div>

          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--nav-text)",
              opacity: 0.6,
              textAlign: "right",
            }}
          >
            Edition 2026 · Vol. 01
          </div>
        </div>

        <div
          style={{
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8125rem",
            color: "var(--nav-text)",
            opacity: 0.6,
          }}
        >
          <span>© 2026 CampusNest</span>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            A. Nivetha · University of Vavuniya · IT2234
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
