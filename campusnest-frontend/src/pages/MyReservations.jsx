import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await API.get(
          `/reservations/student/${user.universityId}`
        );
        setReservations(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    if (user) fetchReservations();
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(reservations.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to cancel reservation");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") return (
      <span className="badge badge-success">✅ Approved</span>
    );
    if (status === "rejected") return (
      <span className="badge badge-danger">❌ Rejected</span>
    );
    return (
      <span className="badge badge-warning">⏳ Pending</span>
    );
  };

  if (loading) return (
    <p style={{ textAlign: "center", padding: "60px" }}>
      Loading...
    </p>
  );

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ color: "var(--accent)", marginBottom: "24px" }}>
        📅 My Reservations
      </h2>
      {reservations.length === 0 ? (
        <div className="card" style={{
          textAlign: "center",
          padding: "40px"
        }}>
          <p style={{ color: "var(--ink-muted)" }}>No reservations yet!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {reservations.map((reservation) => (
            <div key={reservation._id} className="card">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  {/* Listing Name */}
                  <h4 style={{
                    color: "var(--accent)",
                    marginBottom: "8px"
                  }}>
                    🏠 {reservation.listing?.name || "Listing"}
                  </h4>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                    📍 {reservation.listing?.address || ""}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                    💰 LKR {reservation.listing?.payment?.monthlyRent || ""}/month
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                    📅 Move In: {new Date(reservation.moveInDate)
                      .toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                    ⏱️ Duration: {reservation.duration}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                    📞 Contact: {reservation.contactNumber}
                  </p>
                  {reservation.listing?.ownerContact && (
                    <p style={{ fontSize: "14px", color: "var(--ink-muted)" }}>
                      👤 Owner: {reservation.listing?.ownerName} — {reservation.listing?.ownerContact}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  {getStatusBadge(reservation.status)}
                  <br /><br />
                  {reservation.status === "pending" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(reservation._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;

