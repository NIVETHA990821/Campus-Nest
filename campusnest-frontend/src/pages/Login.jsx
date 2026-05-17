import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.data, res.data.token);
      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--nav-bg) 0%, var(--accent-deep) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "var(--bg-alt)",
        border: "1px solid var(--line)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🏠</div>
          <h1 style={{ color: "var(--ink)", fontSize: "24px", marginBottom: "4px" }}>
            CampusNest
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "14px" }}>
            Student Accommodation System
          </p>
        </div>

        <h2 style={{ color: "var(--ink)", marginBottom: "24px", fontSize: "20px" }}>
          Welcome Back! 👋
        </h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "12px", fontSize: "16px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "var(--ink-muted)"
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{
            color: "var(--accent)",
            fontWeight: "bold",
            textDecoration: "none"
          }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

