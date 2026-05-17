import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const REPORT_REASONS = [
  "Fake listing",
  "Wrong price information",
  "Unsafe area",
  "Bars or clubs nearby",
  "Landlord is rude or threatening",
  "Place does not exist",
  "Other",
];

const SingleListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const [reservationForm, setReservationForm] = useState({
    moveInDate: "",
    duration: "1 month",
    contactNumber: "",
  });
  const [reviewForm, setReviewForm] = useState({
    rating: { overall: 5, cleanliness: 5, safety: 5, value: 5, landlord: 5 },
    comment: "",
    stayDuration: "1 month",
    wouldRecommend: true,
  });
  const [reportForm, setReportForm] = useState({
    reason: REPORT_REASONS[0],
    description: "",
    contactNumber: "",
  });
  const [showReportForm, setShowReportForm] = useState(false);

  // Sectioned messages — each form has its own success/error display
  const [reservationMsg, setReservationMsg] = useState({ type: "", text: "" });
  const [reviewMsg, setReviewMsg] = useState({ type: "", text: "" });
  const [reportMsg, setReportMsg] = useState({ type: "", text: "" });

  // Phone validation warnings (per field)
  const [reservePhoneWarn, setReservePhoneWarn] = useState("");
  const [reportPhoneWarn, setReportPhoneWarn] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, reviewRes, reportRes] = await Promise.all([
          API.get(`/listings/${id}`),
          API.get(`/reviews/${id}`),
        ]);
        setListing(listingRes.data.data);
        setReviews(reviewRes.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Reusable phone change handler factory
  const makePhoneHandler = (setter, field, setWarn) => (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 10) {
      setWarn("⚠️ Phone number cannot exceed 10 digits");
      return;
    }
    if (digits.length > 0 && digits.length < 10) {
      setWarn("Phone number must be exactly 10 digits");
    } else {
      setWarn("");
    }
    setter((prev) => ({ ...prev, [field]: digits }));
  };

  const handleReservePhone = makePhoneHandler(
    setReservationForm,
    "contactNumber",
    setReservePhoneWarn
  );
  const handleReportPhone = makePhoneHandler(
    setReportForm,
    "contactNumber",
    setReportPhoneWarn
  );

  const handleReserve = async () => {
    if (!user) {
      setReservationMsg({ type: "error", text: "Please login first!" });
      return;
    }
    if (user.role !== "student") {
      setReservationMsg({ type: "error", text: "Only students can reserve rooms!" });
      return;
    }
    if (!reservationForm.moveInDate) {
      setReservationMsg({ type: "error", text: "Please select move in date!" });
      return;
    }
    if (reservationForm.contactNumber.length !== 10) {
      setReservationMsg({
        type: "error",
        text: "Contact number must be exactly 10 digits!",
      });
      return;
    }
    setReserving(true);
    try {
      await API.post(`/reservations/${id}`, {
        studentName: user.name,
        universityId: user.universityId,
        contactNumber: reservationForm.contactNumber,
        moveInDate: reservationForm.moveInDate,
        duration: reservationForm.duration,
      });
      setReservationMsg({
        type: "success",
        text: "Reservation submitted successfully! 🎉",
      });
      setReservationForm({ moveInDate: "", duration: "1 month", contactNumber: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Reservation failed";
      setReservationMsg({
        type: "error",
        text:
          msg === "You have already reserved this listing!"
            ? "⚠️ You have already reserved this listing!"
            : msg,
      });
    }
    setReserving(false);
  };

  const handleReview = async () => {
    if (!user) {
      setReviewMsg({ type: "error", text: "Please login first!" });
      return;
    }
    if (user.role !== "student") {
      setReviewMsg({ type: "error", text: "Only students can write reviews!" });
      return;
    }
    if (!reviewForm.comment.trim()) {
      setReviewMsg({ type: "error", text: "Please write a comment!" });
      return;
    }
    try {
      await API.post(`/reviews/${id}`, {
        studentName: user.name,
        universityId: user.universityId,
        stayDuration: reviewForm.stayDuration,
        rating: reviewForm.rating,
        wouldRecommend: reviewForm.wouldRecommend,
        comment: reviewForm.comment,
      });
      setReviewMsg({ type: "success", text: "Review submitted successfully! ⭐" });
      setReviewForm({
        rating: { overall: 5, cleanliness: 5, safety: 5, value: 5, landlord: 5 },
        comment: "",
        stayDuration: "1 month",
        wouldRecommend: true,
      });
      const reviewRes = await API.get(`/reviews/${id}`);
      setReviews(reviewRes.data.data);
    } catch (err) {
      setReviewMsg({
        type: "error",
        text: err.response?.data?.message || "Review failed",
      });
    }
  };

  const handleReport = async () => {
    if (!user) {
      setReportMsg({ type: "error", text: "Please login first!" });
      return;
    }
    if (user.role !== "student") {
      setReportMsg({ type: "error", text: "Only students can report listings!" });
      return;
    }
    if (!reportForm.description.trim()) {
      setReportMsg({ type: "error", text: "Please describe the issue!" });
      return;
    }
    if (reportForm.contactNumber.length !== 10) {
      setReportMsg({
        type: "error",
        text: "Contact number must be exactly 10 digits!",
      });
      return;
    }
    try {
      await API.post(`/reports/${id}`, {
        reportedBy: user.name,
        universityId: user.universityId,
        contactNumber: reportForm.contactNumber,
        reason: reportForm.reason,
        description: reportForm.description,
      });
      setReportMsg({ type: "success", text: "Report submitted successfully! 🚩" });
      setReportForm({
        reason: REPORT_REASONS[0],
        description: "",
        contactNumber: "",
      });
      setTimeout(() => setShowReportForm(false), 1500);
    } catch (err) {
      setReportMsg({
        type: "error",
        text: err.response?.data?.message || "Report failed",
      });
    }
  };

  // Small helper to render a section message
  const SectionMsg = ({ msg }) =>
    msg.text ? (
      <div
        className={`alert ${msg.type === "success" ? "alert-success" : "alert-error"}`}
        style={{ marginBottom: "12px" }}
      >
        {msg.text}
      </div>
    ) : null;

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>
    );
  if (!listing)
    return (
      <p style={{ textAlign: "center", padding: "60px" }}>Listing not found!</p>
    );

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      {/* Listing Header */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ color: "var(--accent)" }}>{listing.name}</h2>
          <span
            className={`badge ${
              listing.isAvailable ? "badge-success" : "badge-danger"
            }`}
          >
            {listing.isAvailable ? "Available" : "Occupied"}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {/* Basic Info */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>
              📋 Basic Info
            </h4>
            <p>🏠 Type: {listing.type}</p>
            <p>📍 Address: {listing.address}</p>
            <p>🏫 Distance: {listing.distanceFromUniversityKm} km</p>
            <p>👥 Capacity: {listing.capacity} people</p>
            <p>
              📞 Owner: {listing.ownerName} ({listing.ownerContact})
            </p>
          </div>

          {/* Payment */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>💰 Payment</h4>
            <p>Monthly Rent: LKR {listing.payment?.monthlyRent}</p>
            <p>
              Advance:{" "}
              {Number(listing.payment?.advanceMonths) === 0
                ? "Not required"
                : `LKR ${listing.payment?.advancePayment} (${listing.payment?.advanceMonths} months)`}
            </p>
            <p>
              Utilities:{" "}
              {listing.payment?.utilitiesIncluded
                ? "✅ Included"
                : "❌ Not included"}
            </p>
          </div>

          {/* Rules */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>📏 Rules</h4>
            <p>👤 Gender: {listing.rules?.genderAllowed}</p>
            <p>
              🐾 Pets:{" "}
              {listing.rules?.petsAllowed ? "✅ Allowed" : "❌ Not allowed"}
            </p>
            <p>
              👥 Visitors:{" "}
              {listing.rules?.visitorsAllowed ? "✅ Allowed" : "❌ Not allowed"}
            </p>
            <p>🕐 Curfew: {listing.rules?.curfewTime}</p>
          </div>

          {/* Facilities */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>
              🏪 Facilities
            </h4>
            <p>
              🛒 Supermarket:{" "}
              {listing.hasNearbyFacilities?.supermarket ? "✅" : "❌"}
            </p>
            <p>
              💊 Pharmacy:{" "}
              {listing.hasNearbyFacilities?.pharmacy ? "✅" : "❌"}
            </p>
            <p>
              📚 Book Shop:{" "}
              {listing.hasNearbyFacilities?.bookShop ? "✅" : "❌"}
            </p>
            <p>📶 WiFi: {listing.hasNearbyFacilities?.wifi ? "✅" : "❌"}</p>
            <p>
              🚌 Bus Halt:{" "}
              {listing.hasNearbyFacilities?.transport?.busHalt ? "✅" : "❌"}
            </p>
            <p>
              🚗 Auto Stand:{" "}
              {listing.hasNearbyFacilities?.transport?.autoStand ? "✅" : "❌"}
            </p>
          </div>

          {/* Meals */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>🍽️ Meals</h4>
            <p>👨‍🍳 Can Cook: {listing.meals?.canCook ? "✅" : "❌"}</p>
            <p>
              🛵 Order Food: {listing.meals?.orderFoodAvailable ? "✅" : "❌"}
            </p>
            <p>
              🍱 Meals Provided: {listing.meals?.mealsProvided ? "✅" : "❌"}
            </p>
            {listing.meals?.mealsProvided && (
              <p>💰 Meal Price: LKR {listing.meals?.mealPrice}</p>
            )}
          </div>

          {/* Furnishing */}
          <div>
            <h4 style={{ color: "var(--accent)", marginBottom: "12px" }}>
              🛋️ Furnishing
            </h4>
            <p>
              Furnished:{" "}
              {listing.furnishing?.isFurnished ? "✅ Yes" : "❌ No"}
            </p>
            {listing.furnishing?.isFurnished && (
              <p>Items: {listing.furnishing?.items?.join(", ")}</p>
            )}
          </div>
        </div>

        {/* Safety */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "var(--bg-deep)",
            borderRadius: "8px",
          }}
        >
          <p>🔒 Safe Area: {listing.isSafe ? "✅ Yes" : "❌ No"}</p>
          <p>
            🚫 No Bars/Clubs:{" "}
            {listing.noBarsOrClubs ? "✅ Confirmed" : "❌ Not confirmed"}
          </p>
        </div>
      </div>

      {/* Reserve Room */}
      {user?.role === "student" && listing.isAvailable && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            📅 Reserve This Room
          </h3>
          <SectionMsg msg={reservationMsg} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label>Move In Date</label>
              <input
                type="date"
                value={reservationForm.moveInDate}
                onChange={(e) =>
                  setReservationForm({
                    ...reservationForm,
                    moveInDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Duration</label>
              <select
                value={reservationForm.duration}
                onChange={(e) =>
                  setReservationForm({
                    ...reservationForm,
                    duration: e.target.value,
                  })
                }
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
                <option value="2 years">2 Years</option>
                <option value="3 years">3 Years</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Contact Number (10 digits)</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="e.g. 0771234567"
                value={reservationForm.contactNumber}
                onChange={(e) => handleReservePhone(e.target.value)}
              />
              {reservePhoneWarn && (
                <small style={{ color: "#dc3545", fontSize: "12px" }}>
                  {reservePhoneWarn}
                </small>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleReserve}
            disabled={reserving}
            style={{ marginTop: "16px" }}
          >
            {reserving ? "Submitting..." : "Reserve Room 🏠"}
          </button>
        </div>
      )}

      {/* Reviews */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
          ⭐ Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p style={{ color: "var(--ink-muted)" }}>No reviews yet!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{
                padding: "16px",
                borderBottom: "1px solid var(--line)",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>{review.studentName}</strong>
                <span className="badge badge-success">
                  ⭐ {review.rating.overall}/5
                </span>
              </div>
              <p
                style={{
                  color: "var(--ink-muted)",
                  fontSize: "13px",
                  margin: "4px 0",
                }}
              >
                Stayed: {review.stayDuration}
              </p>
              <p style={{ fontSize: "14px" }}>{review.comment}</p>
              <p
                style={{
                  fontSize: "13px",
                  color: review.wouldRecommend ? "green" : "red",
                }}
              >
                {review.wouldRecommend
                  ? "✅ Recommends"
                  : "❌ Does not recommend"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Review */}
      {user?.role === "student" && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            ✍️ Write a Review
          </h3>
          {/* Success/error message appears HERE, right above the form */}
          <SectionMsg msg={reviewMsg} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {["overall", "cleanliness", "safety", "value", "landlord"].map(
              (key) => (
                <div className="form-group" key={key} style={{ margin: 0 }}>
                  <label style={{ textTransform: "capitalize" }}>{key}</label>
                  <select
                    value={reviewForm.rating[key]}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: {
                          ...reviewForm.rating,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ⭐
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
          <div className="form-group">
            <label>Stay Duration</label>
            <select
              value={reviewForm.stayDuration}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, stayDuration: e.target.value })
              }
            >
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
              <option value="1 year">1 Year</option>
              <option value="2 years">2 Years</option>
              <option value="3 years">3 Years</option>
            </select>
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea
              rows="3"
              placeholder="Share your experience..."
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Would you recommend?</label>
            <select
              value={reviewForm.wouldRecommend}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  wouldRecommend: e.target.value === "true",
                })
              }
            >
              <option value="true">✅ Yes</option>
              <option value="false">❌ No</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleReview}>
            Submit Review ⭐
          </button>
        </div>
      )}

      {/* Report Listing */}
      {user?.role === "student" && (
        <div className="card" style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ color: "var(--accent)" }}>🚩 Report This Listing</h3>
            <button
              className={showReportForm ? "btn btn-secondary" : "btn btn-danger"}
              onClick={() => {
                setShowReportForm(!showReportForm);
                setReportMsg({ type: "", text: "" });
              }}
              style={{ padding: "8px 16px" }}
            >
              {showReportForm ? "Cancel" : "Open Report Form"}
            </button>
          </div>

          {/* Success/error appears HERE, right above the report form */}
          <SectionMsg msg={reportMsg} />

          {showReportForm && (
            <div>
              <div className="form-group">
                <label>Reason</label>
                <select
                  value={reportForm.reason}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, reason: e.target.value })
                  }
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe the issue in detail..."
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Your Contact Number (10 digits)</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="e.g. 0771234567"
                  value={reportForm.contactNumber}
                  onChange={(e) => handleReportPhone(e.target.value)}
                />
                {reportPhoneWarn && (
                  <small style={{ color: "#dc3545", fontSize: "12px" }}>
                    {reportPhoneWarn}
                  </small>
                )}
              </div>
              <button className="btn btn-danger" onClick={handleReport}>
                Submit Report 🚩
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleListing;
