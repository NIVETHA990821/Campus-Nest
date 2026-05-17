import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import API from "../api/axios";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    gender: "",
    maxPrice: "",
    maxDistance: "",
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = "/listings";
      if (filters.type) url = `/listings/filter/type/${filters.type}`;
      else if (filters.gender) url = `/listings/filter/gender/${filters.gender}`;
      else if (filters.maxPrice) url = `/listings/filter/price/${filters.maxPrice}`;
      else if (filters.maxDistance) url = `/listings/filter/distance/${filters.maxDistance}`;

      const res = await API.get(url);
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchListings();
  };

  const handleReset = async () => {
    setFilters({ type: "", gender: "", maxPrice: "", maxDistance: "" });
    const res = await API.get("/listings");
    setListings(res.data.data);
  };

  return (
    <div className="container" style={{ padding: "64px 0" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingBottom: "32px",
          marginBottom: "32px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div>
          <div className="eyebrow">Directory</div>
          <h1 style={{ fontSize: "3rem" }}>All listings</h1>
        </div>
        {!loading && (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              color: "var(--ink-faint)",
              fontSize: "0.9375rem",
            }}
          >
            {listings.length} {listings.length === 1 ? "result" : "results"}
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div
        style={{
          padding: "24px 0",
          marginBottom: "48px",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) auto auto",
            gap: "20px",
            alignItems: "end",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleFilter}>
              <option value="">All</option>
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="full house">Full House</option>
              <option value="boarding">Boarding</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilter}>
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Mixed</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Max rent (LKR)</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="—"
              value={filters.maxPrice}
              onChange={handleFilter}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Max distance (km)</label>
            <input
              type="number"
              name="maxDistance"
              placeholder="—"
              value={filters.maxDistance}
              onChange={handleFilter}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            Apply
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Listings grid */}
      {loading ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--ink-muted)",
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            padding: "80px 0",
          }}
        >
          Loading…
        </p>
      ) : listings.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--ink-muted)",
            fontStyle: "italic",
            fontFamily: "var(--font-display)",
            padding: "80px 0",
          }}
        >
          No listings match your filters.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
