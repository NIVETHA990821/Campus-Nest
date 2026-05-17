import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filters for Reports tab
  const [filterListing, setFilterListing] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [reportSearch, setReportSearch] = useState("");

  // Filters for Users tab
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Filters for Listings tab
  const [listingSearch, setListingSearch] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("all");
  const [listingAvailFilter, setListingAvailFilter] = useState("all");

  // Reusable filter-bar styles
  const filterBarStyle = {
    background: "var(--bg-alt)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius-card)",
    padding: "16px",
    marginBottom: "20px",
    display: "grid",
    gap: "12px",
    alignItems: "end",
  };

  // Inline table header style — forces midnight bg + white text
  // (overrides global th rule for this specific table)
  const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    color: "var(--nav-text)",
    background: "var(--nav-bg)",
    fontSize: "0.6875rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    borderBottom: "1px solid var(--nav-line)",
  };

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, reportsRes, listingsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/admin/reports"),
        API.get("/listings"),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setReports(reportsRes.data.data);
      setListings(listingsRes.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`))
      return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setMessage({ type: "success", text: "User deleted successfully" });
      fetchAll();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete user",
      });
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await API.put(`/admin/reports/${reportId}`, { status });
      setMessage({
        type: "success",
        text: `Report marked as ${status}`,
      });
      fetchAll();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update report",
      });
    }
  };

  const handleDeleteListing = async (listingId, listingName) => {
    if (
      !window.confirm(
        `Delete listing "${listingName}"? This cannot be undone and will affect the owner.`
      )
    )
      return;
    try {
      await API.delete(`/admin/listings/${listingId}`);
      setMessage({ type: "success", text: "Listing deleted by admin" });
      fetchAll();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete listing",
      });
    }
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

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    color: activeTab === tab ? "var(--accent)" : "#666",
    borderBottom:
      activeTab === tab ? "3px solid var(--accent)" : "3px solid transparent",
    marginBottom: "-2px",
  });

  const StatCard = ({ title, value, color = "var(--accent)", emoji }) => (
    <div
      style={{
        background: "var(--bg-alt)",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p style={{ fontSize: "13px", color: "var(--ink-muted)", marginBottom: "6px" }}>
        {emoji} {title}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 700, color: color }}>
        {value}
      </p>
    </div>
  );

  if (loading)
    return <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h2 style={{ color: "var(--accent)" }}>👑 Admin Dashboard</h2>
        <span
          style={{
            background: "var(--nav-bg)",
            color: "var(--nav-text)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Logged in as: {user?.name}
        </span>
      </div>
      <p style={{ color: "var(--ink-muted)", marginBottom: "24px", fontSize: "14px" }}>
        Platform-wide moderation and oversight
      </p>

      {message.text && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "24px",
          borderBottom: "2px solid #eee",
        }}
      >
        <button onClick={() => setActiveTab("overview")} style={tabStyle("overview")}>
          📊 Overview
        </button>
        <button onClick={() => setActiveTab("users")} style={tabStyle("users")}>
          👥 Users ({users.length})
        </button>
        <button onClick={() => setActiveTab("reports")} style={tabStyle("reports")}>
          🚩 Reports ({reports.length})
          {reports.filter((r) => r.status === "pending").length > 0 && (
            <span
              style={{
                marginLeft: "6px",
                background: "#dc3545",
                color: "white",
                borderRadius: "10px",
                padding: "2px 6px",
                fontSize: "11px",
              }}
            >
              {reports.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab("listings")} style={tabStyle("listings")}>
          🏠 Listings ({listings.length})
        </button>
      </div>

      {/* Overview */}
      {activeTab === "overview" && stats && (
        <div>
          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            👥 Users
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <StatCard
              emoji="👤"
              title="Total Users"
              value={stats.users.total}
              color="var(--accent)"
            />
            <StatCard
              emoji="🎓"
              title="Students"
              value={stats.users.students}
              color="#28a745"
            />
            <StatCard
              emoji="🏠"
              title="Owners"
              value={stats.users.owners}
              color="#ffc107"
            />
          </div>

          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>🏠 Listings</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <StatCard
              emoji="📋"
              title="Total Listings"
              value={stats.listings.total}
              color="var(--accent)"
            />
            <StatCard
              emoji="✅"
              title="Available"
              value={stats.listings.available}
              color="#28a745"
            />
            <StatCard
              emoji="🚫"
              title="Occupied"
              value={stats.listings.occupied}
              color="#dc3545"
            />
          </div>

          <h3 style={{ color: "var(--accent)", marginBottom: "16px" }}>
            📅 Activity
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <StatCard
              emoji="📅"
              title="Reservations"
              value={stats.reservations.total}
              color="var(--accent)"
            />
            <StatCard
              emoji="⏳"
              title="Pending"
              value={stats.reservations.pending}
              color="#ffc107"
            />
            <StatCard
              emoji="⭐"
              title="Reviews"
              value={stats.reviews.total}
              color="#28a745"
            />
            <StatCard
              emoji="🚩"
              title="Pending Reports"
              value={stats.reports.pending}
              color="#dc3545"
            />
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === "users" && (() => {
        const term = userSearch.trim().toLowerCase();
        const filteredUsers = users.filter((u) => {
          if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
          if (!term) return true;
          return (
            (u.name || "").toLowerCase().includes(term) ||
            (u.email || "").toLowerCase().includes(term) ||
            (u.universityId || "").toLowerCase().includes(term)
          );
        });

        return (
        <div>
          {/* Filter bar */}
          <div
            style={{ ...filterBarStyle, gridTemplateColumns: "2fr 1fr auto" }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🔍 Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or university ID"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                👤 Role
              </label>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">🎓 Students</option>
                <option value="owner">🏠 Owners</option>
                <option value="admin">👑 Admins</option>
              </select>
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px", height: "fit-content" }}
              onClick={() => {
                setUserSearch("");
                setUserRoleFilter("all");
              }}
            >
              Clear
            </button>
          </div>

          {/* Result count */}
          <p style={{ fontSize: "13px", color: "var(--ink-muted)", marginBottom: "12px" }}>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} users
          </p>

          {users.length === 0 ? (
            <p style={{ color: "var(--ink-muted)" }}>No users yet</p>
          ) : filteredUsers.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--ink-muted)" }}>
                No users match the current filters.
              </p>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                background: "var(--bg-alt)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "var(--bg-alt)",
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--nav-bg)" }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>University ID</th>
                    <th style={thStyle}>Joined</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "12px" }}>{u.name}</td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>
                        {u.email}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          className={`badge ${
                            u.role === "admin"
                              ? "badge-danger"
                              : u.role === "owner"
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {u.role === "admin" && "👑 "}
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>
                        {u.universityId || "—"}
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>
                        {formatDate(u.createdAt)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {u.role !== "admin" ? (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            🗑️ Delete
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--ink-faint)" }}>
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        );
      })()}

      {/* Reports tab */}
      {activeTab === "reports" && (() => {
        // Hide dismissed reports entirely from the dashboard.
        // (Both "Dismiss" and "Take Down Listing" actions set status to "dismissed".)
        const activeReports = reports.filter((r) => r.status !== "dismissed");

        // Build unique boarding (listing) and reason lists from ACTIVE reports
        const uniqueListings = Array.from(
          new Map(
            activeReports
              .filter((r) => r.listing?._id)
              .map((r) => [r.listing._id, r.listing.name])
          ).entries()
        );
        const uniqueReasons = Array.from(
          new Set(activeReports.map((r) => r.reason))
        );

        // Apply all filters on the active set
        const term = reportSearch.trim().toLowerCase();
        const filteredReports = activeReports.filter((r) => {
          if (filterListing !== "all") {
            const id = r.listing?._id || r.listing;
            if (id !== filterListing) return false;
          }
          if (filterStatus !== "all" && r.status !== filterStatus) return false;
          if (filterReason !== "all" && r.reason !== filterReason) return false;
          if (term) {
            const haystack = (
              (r.description || "") + " " +
              (r.reportedBy || "") + " " +
              (r.reason || "")
            ).toLowerCase();
            if (!haystack.includes(term)) return false;
          }
          return true;
        });

        return (
        <div>
          {/* Filter bar */}
          <div
            style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--line)",
              padding: "16px",
              borderRadius: "var(--radius-card)",
              marginBottom: "16px",
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr auto",
              gap: "12px",
              alignItems: "end",
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🔍 Search Reports
              </label>
              <input
                type="text"
                placeholder="Search description, reporter, or reason"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🏠 Filter by Boarding
              </label>
              <select
                value={filterListing}
                onChange={(e) => setFilterListing(e.target.value)}
              >
                <option value="all">All Boardings ({uniqueListings.length})</option>
                {uniqueListings.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                📊 Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="reviewed">✅ Reviewed</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🚩 Reason
              </label>
              <select
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
              >
                <option value="all">All Reasons</option>
                {uniqueReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px", height: "fit-content" }}
              onClick={() => {
                setFilterListing("all");
                setFilterStatus("all");
                setFilterReason("all");
                setReportSearch("");
              }}
            >
              Clear
            </button>
          </div>

          {/* Result count */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-muted)",
              marginBottom: "12px",
            }}
          >
            Showing <strong>{filteredReports.length}</strong> of {activeReports.length} reports
          </p>

          {activeReports.length === 0 ? (
            <p style={{ color: "var(--ink-muted)" }}>No active reports 🎉</p>
          ) : filteredReports.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--ink-muted)" }}>
                No reports match the current filters.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              // Count other reports against the SAME listing that have been
              // marked as reviewed. Excludes this report itself.
              const listingId = report.listing?._id || report.listing;
              const previousReviewedCount = reports.filter(
                (r) =>
                  r._id !== report._id &&
                  r.status === "reviewed" &&
                  (r.listing?._id || r.listing) === listingId
              ).length;

              return (
              <div
                key={report._id}
                className="card"
                style={{
                  marginBottom: "12px",
                  borderLeft:
                    report.status === "pending"
                      ? "4px solid #dc3545"
                      : report.status === "dismissed"
                      ? "4px solid #888"
                      : "4px solid #28a745",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <h4 style={{ color: "var(--accent)" }}>🚩 {report.reason}</h4>
                    <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>
                      Listing:{" "}
                      <strong>
                        {report.listing?.name || "[deleted listing]"}
                      </strong>
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>
                      Filed {formatDate(report.createdAt)}
                    </p>
                    {previousReviewedCount > 0 && (
                      <p
                        style={{
                          fontSize: "13px",
                          marginTop: "6px",
                          color: "var(--ink)",
                          background: "var(--warning-soft)",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        ⚠️ This listing has{" "}
                        <strong style={{ color: "#dc3545", fontSize: "15px" }}>
                          {previousReviewedCount}
                        </strong>{" "}
                        previously reviewed report
                        {previousReviewedCount !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <span
                    className={`badge ${
                      report.status === "pending"
                        ? "badge-warning"
                        : report.status === "dismissed"
                        ? "badge-secondary"
                        : "badge-success"
                    }`}
                  >
                    {report.status === "pending" && "⏳ Pending"}
                    {report.status === "reviewed" && "✅ Reviewed"}
                    {report.status === "dismissed" && "🚫 Dismissed"}
                  </span>
                </div>

                <div
                  style={{
                    background: "var(--bg-deep)",
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    fontSize: "14px",
                  }}
                >
                  {report.description}
                </div>

                <div style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                  <p>
                    <strong>Reported by:</strong> {report.reportedBy}
                  </p>
                  <p>
                    <strong>🎓 University ID:</strong> {report.universityId}
                  </p>
                  <p>
                    <strong>📞 Contact:</strong> {report.contactNumber}
                  </p>
                </div>

                {report.status === "pending" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <button
                      className="btn btn-success"
                      onClick={() => handleResolveReport(report._id, "reviewed")}
                      style={{ padding: "6px 12px", fontSize: "13px" }}
                    >
                      ✅ Mark as Reviewed
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        handleResolveReport(report._id, "dismissed")
                      }
                      style={{ padding: "6px 12px", fontSize: "13px" }}
                    >
                      🚫 Dismiss (false report)
                    </button>
                    {report.listing?._id && (
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDeleteListing(
                            report.listing._id,
                            report.listing.name
                          )
                        }
                        style={{ padding: "6px 12px", fontSize: "13px" }}
                      >
                        🗑️ Take Down Listing
                      </button>
                    )}
                  </div>
                )}
              </div>
              );
            })
          )}
        </div>
        );
      })()}

      {/* Listings tab */}
      {activeTab === "listings" && (() => {
        const term = listingSearch.trim().toLowerCase();
        const filteredListings = listings.filter((l) => {
          if (listingTypeFilter !== "all" && l.type !== listingTypeFilter) return false;
          if (listingAvailFilter === "available" && !l.isAvailable) return false;
          if (listingAvailFilter === "occupied" && l.isAvailable) return false;
          if (!term) return true;
          return (
            (l.name || "").toLowerCase().includes(term) ||
            (l.address || "").toLowerCase().includes(term) ||
            (l.type || "").toLowerCase().includes(term)
          );
        });

        return (
        <div>
          {/* Filter bar */}
          <div
            style={{ ...filterBarStyle, gridTemplateColumns: "2fr 1fr 1fr auto" }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🔍 Search Listings
              </label>
              <input
                type="text"
                placeholder="Search by name, address, or type"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                🏠 Type
              </label>
              <select
                value={listingTypeFilter}
                onChange={(e) => setListingTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="single">Single</option>
                <option value="shared">Shared</option>
                <option value="full house">Full House</option>
                <option value="boarding">Boarding</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                📅 Availability
              </label>
              <select
                value={listingAvailFilter}
                onChange={(e) => setListingAvailFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">✅ Available</option>
                <option value="occupied">🚫 Occupied</option>
              </select>
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px", height: "fit-content" }}
              onClick={() => {
                setListingSearch("");
                setListingTypeFilter("all");
                setListingAvailFilter("all");
              }}
            >
              Clear
            </button>
          </div>

          <p style={{ fontSize: "13px", color: "var(--ink-muted)", marginBottom: "12px" }}>
            Showing <strong>{filteredListings.length}</strong> of {listings.length} listings
          </p>

          {listings.length === 0 ? (
            <p style={{ color: "var(--ink-muted)" }}>No listings yet</p>
          ) : filteredListings.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--ink-muted)" }}>
                No listings match the current filters.
              </p>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <div
                key={listing._id}
                className="card"
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ color: "var(--accent)", marginBottom: "4px" }}>
                    {listing.name}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--ink-muted)" }}>
                    {listing.type} • {listing.address} • LKR{" "}
                    {listing.payment?.monthlyRent}/month
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--ink-faint)" }}>
                    Created {formatDate(listing.createdAt)}
                  </p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteListing(listing._id, listing.name)}
                  style={{ padding: "6px 12px", fontSize: "13px" }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))
          )}
        </div>
        );
      })()}
    </div>
  );
};

export default AdminDashboard;
