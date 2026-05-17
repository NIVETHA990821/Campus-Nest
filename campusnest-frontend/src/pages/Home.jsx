import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero with warm gradient backdrop */}
      <section
        style={{
          position: "relative",
          padding: "100px 0 120px",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at top, rgba(229, 72, 77, 0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse at bottom right, rgba(0, 133, 122, 0.06) 0%, transparent 50%), " +
            "var(--bg)",
        }}
      >
        {/* Decorative blurred circles */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "var(--accent-soft)",
            filter: "blur(80px)",
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: "24px",
                letterSpacing: "-0.04em",
              }}
            >
              Find a place near campus{" "}
              <span style={{ color: "var(--accent)" }}>
                that feels like home.
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.1875rem",
                color: "var(--ink-muted)",
                lineHeight: 1.55,
                maxWidth: "620px",
                margin: "0 auto 40px",
              }}
            >
              Verified boardings, honest student reviews, and clear pricing.
              Browse rooms near your university in under a minute.
            </p>

            {/* Faux search shell that links to listings */}
            <Link
              to="/listings"
              style={{
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 8px 8px 24px",
                  boxShadow: "var(--shadow)",
                  gap: "24px",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  Where to?
                </span>
                <span
                  style={{
                    color: "var(--ink-faint)",
                    fontSize: "0.875rem",
                    borderLeft: "1px solid var(--line)",
                    paddingLeft: "24px",
                  }}
                >
                  Any university · Any budget
                </span>
                <span
                  className="btn btn-primary"
                  style={{ padding: "12px 20px" }}
                >
                  Browse →
                </span>
              </div>
            </Link>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              marginTop: "96px",
              padding: "32px 0",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {[
              { num: "200+", label: "Verified listings" },
              { num: "98%", label: "Student satisfaction" },
              { num: "12", label: "Universities covered" },
              { num: "4.7★", label: "Average rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ textAlign: "center", padding: "0 16px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.25rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "-0.03em",
                    marginBottom: "4px",
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--ink-muted)",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — like Airbnb's category bar */}
      <section style={{ padding: "80px 0", background: "var(--surface)" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "48px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "8px" }}>Browse by type</h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "1rem" }}>
                From quiet singles to full houses with friends.
              </p>
            </div>
            <Link
              to="/listings"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              View all →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {[
              {
                emoji: "🛏️",
                label: "Single rooms",
                desc: "Your own space, your own rules",
                bg: "linear-gradient(135deg, #fef3f2, #fff1f2)",
              },
              {
                emoji: "👯",
                label: "Shared rooms",
                desc: "Make a friend, split the cost",
                bg: "linear-gradient(135deg, #e6f3f1, #d8efe9)",
              },
              {
                emoji: "🏘️",
                label: "Full houses",
                desc: "Take it all with your crew",
                bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
              },
              {
                emoji: "🏨",
                label: "Boarding",
                desc: "Meals, rules, the whole deal",
                bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
              },
            ].map((cat) => (
              <Link
                key={cat.label}
                to="/listings"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--surface)",
                    transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-hover)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--line)";
                  }}
                >
                  <div
                    style={{
                      height: "140px",
                      background: cat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3.5rem",
                    }}
                  >
                    {cat.emoji}
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h4 style={{ marginBottom: "4px" }}>{cat.label}</h4>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "100px 0", background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ marginBottom: "12px" }}>How CampusNest works</h2>
            <p
              style={{
                color: "var(--ink-muted)",
                fontSize: "1.0625rem",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              Three ways we make finding student housing actually feel safe.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {[
              {
                num: "01",
                title: "Verified locations",
                body: "Every listing declares nearby facilities, transport, and safety zones. No surprise bars or clubs next door.",
                color: "var(--accent)",
                bg: "var(--accent-soft)",
              },
              {
                num: "02",
                title: "Real student reviews",
                body: "Reviews come only from students who actually reserved a room. Ratings on cleanliness, safety, and the landlord.",
                color: "var(--teal)",
                bg: "var(--teal-soft)",
              },
              {
                num: "03",
                title: "Independent moderation",
                body: "A neutral admin team handles reports against owners. Bad actors get taken down. Disputes resolved fairly.",
                color: "var(--warning)",
                bg: "var(--warning-soft)",
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-sm)",
                    background: step.bg,
                    color: step.color,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    marginBottom: "20px",
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ marginBottom: "12px", fontSize: "1.375rem" }}>
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section
        style={{
          padding: "80px 0",
          background:
            "linear-gradient(135deg, var(--ink) 0%, #2a2a2a 100%)",
          color: "var(--surface)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
            <h2
              style={{
                color: "var(--surface)",
                marginBottom: "12px",
                fontSize: "2rem",
              }}
            >
              Own a boarding? List it here.
            </h2>
            <p
              style={{
                color: "var(--ink-faint)",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Reach thousands of students looking for safe, affordable rooms.
              Free to list, free to manage.
            </p>
          </div>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{ padding: "16px 32px", fontSize: "1rem" }}
          >
            Become a host →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
