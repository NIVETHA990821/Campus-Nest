import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const ListingCard = ({ listing }) => {
  const { user } = useAuth();
  const [wished, setWished] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please sign in first.");
      return;
    }
    if (user.role !== "student") {
      alert("Only students can save listings.");
      return;
    }
    try {
      await API.post(`/wishlist/${user.universityId}/${listing._id}`, {
        studentName: user.name,
      });
      setWished(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to wishlist");
    }
  };

  return (
    <article
      style={{
        background: "var(--bg-alt)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--line-strong)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row: type / availability */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--ink-faint)",
          }}
        >
          {listing.type}
        </span>
        <span
          className={`badge ${
            listing.isAvailable ? "badge-success" : "badge-secondary"
          }`}
        >
          {listing.isAvailable ? "Available" : "Occupied"}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 450,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          color: "var(--ink)",
        }}
      >
        {listing.name}
      </h3>

      {/* Address — italic serif eyebrow */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--ink-muted)",
          fontStyle: "italic",
          fontFamily: "var(--font-display)",
          marginTop: "-12px",
        }}
      >
        {listing.address}
      </p>

      {/* Key facts as a definition list */}
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 24px",
          fontSize: "0.875rem",
        }}
      >
        <Fact label="Distance" value={`${listing.distanceFromUniversityKm} km`} />
        <Fact label="Capacity" value={`${listing.capacity} people`} />
        <Fact
          label="Rent"
          value={`LKR ${Number(listing.payment?.monthlyRent || 0).toLocaleString()}/mo`}
          highlight
        />
        <Fact label="Gender" value={listing.rules?.genderAllowed || "—"} />
      </dl>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "8px",
          paddingTop: "20px",
          borderTop: "1px solid var(--line)",
        }}
      >
        <Link
          to={`/listings/${listing._id}`}
          className="btn btn-primary"
          style={{ flex: 1 }}
        >
          View listing →
        </Link>
        {user?.role === "student" && (
          <button
            onClick={handleWishlist}
            className="btn btn-secondary"
            style={{ padding: "11px 16px" }}
            title="Save"
          >
            {wished ? "★ Saved" : "☆ Save"}
          </button>
        )}
      </div>
    </article>
  );
};

const Fact = ({ label, value, highlight }) => (
  <div>
    <dt
      style={{
        fontSize: "0.6875rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--ink-faint)",
        marginBottom: "3px",
      }}
    >
      {label}
    </dt>
    <dd
      style={{
        color: highlight ? "var(--highlight)" : "var(--ink)",
        fontWeight: highlight ? 600 : 400,
        fontFamily: highlight ? "var(--font-display)" : "var(--font-body)",
        fontSize: highlight ? "1rem" : "0.9375rem",
        textTransform: "capitalize",
      }}
    >
      {value}
    </dd>
  </div>
);

export default ListingCard;
