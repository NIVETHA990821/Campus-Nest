import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const FURNISHING_OPTIONS = [
  "Fan",
  "Table",
  "Chair",
  "Bed",
  "Wardrobe",
  "Desk",
  "Light",
];

const EditListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        const data = res.data.data;
        // Ensure nested defaults exist (for old listings)
        setFormData({
          name: data.name || "",
          type: data.type || "single",
          capacity: data.capacity || "",
          address: data.address || "",
          distanceFromUniversityKm: data.distanceFromUniversityKm || "",
          ownerName: data.ownerName || user?.name || "",
          ownerContact: data.ownerContact || "",
          isSafe: data.isSafe ?? true,
          noBarsOrClubs: data.noBarsOrClubs ?? true,
          isAvailable: data.isAvailable ?? true,
          rules: {
            genderAllowed: data.rules?.genderAllowed || "any",
            petsAllowed: data.rules?.petsAllowed ?? false,
            visitorsAllowed: data.rules?.visitorsAllowed ?? false,
            curfewTime: data.rules?.curfewTime || "No Curfew",
          },
          payment: {
            monthlyRent: data.payment?.monthlyRent || "",
            advancePayment: data.payment?.advancePayment || 0,
            advanceMonths: data.payment?.advanceMonths ?? 0,
            utilitiesIncluded: data.payment?.utilitiesIncluded ?? false,
          },
          meals: {
            canCook: data.meals?.canCook ?? false,
            orderFoodAvailable: data.meals?.orderFoodAvailable ?? false,
            mealsProvided: data.meals?.mealsProvided ?? false,
            mealPrice: data.meals?.mealPrice ?? 0,
          },
          furnishing: {
            isFurnished: data.furnishing?.isFurnished ?? false,
            items: data.furnishing?.items || [],
          },
          hasNearbyFacilities: {
            supermarket: data.hasNearbyFacilities?.supermarket ?? false,
            pharmacy: data.hasNearbyFacilities?.pharmacy ?? false,
            bookShop: data.hasNearbyFacilities?.bookShop ?? false,
            wifi: data.hasNearbyFacilities?.wifi ?? false,
            transport: {
              busHalt: data.hasNearbyFacilities?.transport?.busHalt ?? false,
              autoStand:
                data.hasNearbyFacilities?.transport?.autoStand ?? false,
            },
          },
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listing");
      }
      setLoading(false);
    };
    fetchListing();
  }, [id, user]);

  const handlePhoneChange = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 10) {
      setPhoneWarning("⚠️ Phone number cannot exceed 10 digits");
      return;
    }
    if (digits.length > 0 && digits.length < 10) {
      setPhoneWarning("Phone number must be exactly 10 digits");
    } else {
      setPhoneWarning("");
    }
    setFormData({ ...formData, ownerContact: digits });
  };

  const toggleFurnishingItem = (item) => {
    setFormData((prev) => {
      const items = prev.furnishing.items.includes(item)
        ? prev.furnishing.items.filter((i) => i !== item)
        : [...prev.furnishing.items, item];
      return {
        ...prev,
        furnishing: { ...prev.furnishing, items },
      };
    });
  };

  const handleUpdate = async () => {
    if (formData.ownerContact.length !== 10) {
      setError("Owner contact must be exactly 10 digits");
      return;
    }
    try {
      const payload = { ...formData };
      if (Number(payload.payment.advanceMonths) === 0) {
        payload.payment.advancePayment = 0;
      }
      await API.put(`/listings/${id}`, payload);
      setMessage("Listing updated successfully! 🎉");
      setError("");
      setTimeout(() => navigate("/owner-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>;
  if (!formData)
    return (
      <p style={{ textAlign: "center", padding: "60px" }}>
        Listing not found or you do not have access.
      </p>
    );

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
      <h2 style={{ color: "var(--accent)", marginBottom: "24px" }}>
        ✏️ Edit Listing
      </h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Basic Info */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>📋 Basic Info</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div className="form-group">
            <label>Place Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="full house">Full House</option>
              <option value="boarding">Boarding</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Distance from University (km)</label>
            <input
              type="number"
              value={formData.distanceFromUniversityKm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  distanceFromUniversityKm: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Owner Contact (10 digits)</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={formData.ownerContact}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
            {phoneWarning && (
              <small style={{ color: "#dc3545", fontSize: "12px" }}>
                {phoneWarning}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Payment + Advance */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
          💰 Payment & Advance
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div className="form-group">
            <label>Monthly Rent (LKR)</label>
            <input
              type="number"
              value={formData.payment.monthlyRent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment: { ...formData.payment, monthlyRent: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Advance Required</label>
            <select
              value={formData.payment.advanceMonths}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment: {
                    ...formData.payment,
                    advanceMonths: Number(e.target.value),
                  },
                })
              }
            >
              <option value={0}>No advance needed</option>
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
            </select>
          </div>
          {Number(formData.payment.advanceMonths) > 0 && (
            <div className="form-group">
              <label>Advance Payment (LKR)</label>
              <input
                type="number"
                value={formData.payment.advancePayment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: {
                      ...formData.payment,
                      advancePayment: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}
          <div className="form-group">
            <label>Utilities Included?</label>
            <select
              value={formData.payment.utilitiesIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment: {
                    ...formData.payment,
                    utilitiesIncluded: e.target.value === "true",
                  },
                })
              }
            >
              <option value="true">✅ Yes</option>
              <option value="false">❌ No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>🍽️ Meals</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div className="form-group">
            <label>👨‍🍳 Can Cook (kitchen access)</label>
            <select
              value={formData.meals.canCook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  meals: { ...formData.meals, canCook: e.target.value === "true" },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>🛵 Order Food Available</label>
            <select
              value={formData.meals.orderFoodAvailable}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  meals: {
                    ...formData.meals,
                    orderFoodAvailable: e.target.value === "true",
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>🍱 Meals Provided by Owner</label>
            <select
              value={formData.meals.mealsProvided}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  meals: {
                    ...formData.meals,
                    mealsProvided: e.target.value === "true",
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
          {formData.meals.mealsProvided && (
            <div className="form-group">
              <label>Meal Price per Day (LKR)</label>
              <input
                type="number"
                value={formData.meals.mealPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meals: {
                      ...formData.meals,
                      mealPrice: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Furnishing */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>🛋️ Furnishing</h3>
        <div className="form-group">
          <label>Is the Place Furnished?</label>
          <select
            value={formData.furnishing.isFurnished}
            onChange={(e) =>
              setFormData({
                ...formData,
                furnishing: {
                  ...formData.furnishing,
                  isFurnished: e.target.value === "true",
                  items:
                    e.target.value === "true" ? formData.furnishing.items : [],
                },
              })
            }
          >
            <option value="false">❌ No</option>
            <option value="true">✅ Yes</option>
          </select>
        </div>
        {formData.furnishing.isFurnished && (
          <div>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Available Items (tick all that apply)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              {FURNISHING_OPTIONS.map((item) => (
                <label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    padding: "6px",
                    border: "1px solid var(--line)",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.furnishing.items.includes(item)}
                    onChange={() => toggleFurnishingItem(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rules */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>📏 Rules</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div className="form-group">
            <label>Gender Allowed</label>
            <select
              value={formData.rules.genderAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rules: { ...formData.rules, genderAllowed: e.target.value },
                })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div className="form-group">
            <label>Curfew Time</label>
            <input
              type="text"
              value={formData.rules.curfewTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rules: { ...formData.rules, curfewTime: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Pets Allowed?</label>
            <select
              value={formData.rules.petsAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rules: {
                    ...formData.rules,
                    petsAllowed: e.target.value === "true",
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Visitors Allowed?</label>
            <select
              value={formData.rules.visitorsAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rules: {
                    ...formData.rules,
                    visitorsAllowed: e.target.value === "true",
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
          🏪 Nearby Facilities
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { key: "supermarket", label: "🛒 Supermarket" },
            { key: "pharmacy", label: "💊 Pharmacy" },
            { key: "bookShop", label: "📚 Book Shop" },
            { key: "wifi", label: "📶 WiFi" },
          ].map(({ key, label }) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <select
                value={formData.hasNearbyFacilities[key]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasNearbyFacilities: {
                      ...formData.hasNearbyFacilities,
                      [key]: e.target.value === "true",
                    },
                  })
                }
              >
                <option value="false">❌ No</option>
                <option value="true">✅ Yes</option>
              </select>
            </div>
          ))}
          <div className="form-group">
            <label>🚌 Bus Halt</label>
            <select
              value={formData.hasNearbyFacilities.transport.busHalt}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasNearbyFacilities: {
                    ...formData.hasNearbyFacilities,
                    transport: {
                      ...formData.hasNearbyFacilities.transport,
                      busHalt: e.target.value === "true",
                    },
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>🚗 Auto Stand</label>
            <select
              value={formData.hasNearbyFacilities.transport.autoStand}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasNearbyFacilities: {
                    ...formData.hasNearbyFacilities,
                    transport: {
                      ...formData.hasNearbyFacilities.transport,
                      autoStand: e.target.value === "true",
                    },
                  },
                })
              }
            >
              <option value="false">❌ No</option>
              <option value="true">✅ Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Safety, Environment & Availability */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
          🛡️ Safety, Environment & Availability
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label>🔒 Safe Area</label>
            <select
              value={formData.isSafe}
              onChange={(e) =>
                setFormData({ ...formData, isSafe: e.target.value === "true" })
              }
            >
              <option value="true">✅ Yes, I assure</option>
              <option value="false">❌ Not assured</option>
            </select>
            <small
              style={{
                color: "var(--ink-faint)",
                fontSize: "11px",
                display: "block",
                marginTop: "4px",
              }}
            >
              (Owner's assurance)
            </small>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>🚫 No Bars/Clubs Nearby</label>
            <select
              value={formData.noBarsOrClubs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  noBarsOrClubs: e.target.value === "true",
                })
              }
            >
              <option value="true">✅ Confirmed</option>
              <option value="false">❌ Bars/clubs nearby</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>📅 Availability</label>
            <select
              value={formData.isAvailable}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isAvailable: e.target.value === "true",
                })
              }
            >
              <option value="true">✅ Available</option>
              <option value="false">🚫 Occupied</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/owner-dashboard")}
          style={{ flex: 1, padding: "14px", fontSize: "16px" }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          style={{ flex: 2, padding: "14px", fontSize: "16px" }}
        >
          Update Listing 💾
        </button>
      </div>
    </div>
  );
};

export default EditListing;
