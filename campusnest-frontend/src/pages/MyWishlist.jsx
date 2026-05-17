import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const MyWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get(`/wishlist/${user.universityId}`);
        setWishlist(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    if (user) fetchWishlist();
  }, [user]);

  const handleRemove = async (listingId) => {
    try {
      await API.delete(`/wishlist/${user.universityId}/${listingId}`);
      const res = await API.get(`/wishlist/${user.universityId}`);
      setWishlist(res.data.data);
    } catch (err) {
      alert("Failed to remove from wishlist");
    }
  };

  if (loading) return <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ color: "var(--accent)", marginBottom: "24px" }}>
        ❤️ My Wishlist
      </h2>
      {!wishlist || wishlist.listings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--ink-muted)" }}>No saved listings yet!</p>
          <Link to="/listings" className="btn btn-primary" style={{
            marginTop: "16px",
            textDecoration: "none",
            display: "inline-block"
          }}>
            Browse Listings
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px"
        }}>
          {wishlist.listings.map((listing) => (
            <div key={listing._id} className="card">
              <h3 style={{ color: "var(--accent)", marginBottom: "8px" }}>
                {listing.name}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-muted)", marginBottom: "4px" }}>
                🏠 {listing.type}
              </p>
              <p style={{ fontSize: "14px", color: "var(--ink-muted)", marginBottom: "4px" }}>
                📍 {listing.address}
              </p>
              <p style={{ fontSize: "14px", color: "var(--ink-muted)", marginBottom: "16px" }}>
                💰 LKR {listing.payment?.monthlyRent}/month
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to={`/listings/${listing._id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
                >
                  View Details
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(listing._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;


