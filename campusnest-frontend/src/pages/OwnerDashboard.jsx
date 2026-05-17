import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchMyListings = async () => {
    try {
      const res = await API.get("/listings/my");
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchReservations = async (listingId) => {
    try {
      setSelectedListing(listingId);
      const res = await API.get(`/reservations/listing/${listingId}`);
      setReservations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (reservationId, status) => {
    try {
      await API.put(`/reservations/${reservationId}`, { status });
      setMessage({
        type: "success",
        text: `Reservation ${status} successfully!`,
      });
      fetchReservations(selectedListing);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update status",
      });
    }
  };

  const handleDelete = async (listingId, listingName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${listingName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await API.delete(`/listings/${listingId}`);
      setMessage({ type: "success", text: "Listing deleted successfully!" });
      if (selectedListing === listingId) {
        setSelectedListing(null);
        setReservations([]);
      }
      fetchMyListings();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete listing",
      });
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved")
      return <span className="badge badge-success">✅ Approved</span>;
    if (status === "rejected")
      return <span className="badge badge-danger">❌ Rejected</span>;
    return <span className="badge badge-warning">⏳ Pending</span>;
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>
    );

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ color: "var(--accent)" }}>🏠 Owner Dashboard</h2>
        <Link to="/add-listing" className="btn btn-primary">
          ➕ Add New Listing
        </Link>
      </div>

      {message.text && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "24px",
        }}
      >
        {/* Listings Panel */}
        <div>
          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            My Listings ({listings.length})
          </h3>
          {listings.length === 0 ? (
            <div className="card">
              <p style={{ color: "var(--ink-muted)" }}>
                You haven't added any listings yet. Click "Add New Listing" to
                get started!
              </p>
            </div>
          ) : (
            listings.map((listing) => (
              <div
                key={listing._id}
                className="card"
                style={{
                  marginBottom: "12px",
                  border:
                    selectedListing === listing._id
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchReservations(listing._id)}
                >
                  <h4 style={{ color: "var(--accent)", marginBottom: "4px" }}>
                    {listing.name}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                    {listing.type} • LKR {listing.payment?.monthlyRent}/month
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      className={`badge ${
                        listing.isAvailable ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {listing.isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--ink-faint)",
                      marginTop: "6px",
                    }}
                  >
                    📅 Created: {formatDate(listing.createdAt)}
                  </p>
                  {listing.updatedAt &&
                    listing.updatedAt !== listing.createdAt && (
                      <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>
                        ✏️ Last edited: {formatDate(listing.updatedAt)}
                      </p>
                    )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                    borderTop: "1px solid var(--line)",
                    paddingTop: "10px",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "13px", flex: 1 }}
                    onClick={() => navigate(`/edit-listing/${listing._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "6px 12px", fontSize: "13px", flex: 1 }}
                    onClick={() => handleDelete(listing._id, listing.name)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reservations Panel */}
        <div>
          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            Reservations
          </h3>
          {!selectedListing ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <p style={{ color: "var(--ink-muted)" }}>
                👈 Select a listing to view its reservations
              </p>
            </div>
          ) : reservations.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <p style={{ color: "var(--ink-muted)" }}>
                No reservations for this listing yet!
              </p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="card"
                style={{ marginBottom: "12px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4 style={{ color: "var(--accent)", marginBottom: "8px" }}>
                      {reservation.studentName}
                    </h4>
                    <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                      🎓 ID: {reservation.universityId}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                      📞 {reservation.contactNumber}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                      📅 Move in:{" "}
                      {new Date(reservation.moveInDate).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                      ⏱️ Duration: {reservation.duration}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {getStatusBadge(reservation.status)}
                    {reservation.status === "pending" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "12px",
                        }}
                      >
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleStatus(reservation._id, "approved")
                          }
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleStatus(reservation._id, "rejected")
                          }
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
