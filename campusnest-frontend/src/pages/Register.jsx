import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    universityId: "",
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
      const res = await API.post("/auth/register", formData);
      login(res.data.data, res.data.token);
      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: "480px", padding: "60px 20px" }}>
      <div className="card">
        <h2 style={{ textAlign: "center", color: "var(--accent)", marginBottom: "24px" }}>
          Create Account 🏠
        </h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <small style={{ color: "#f7ad77", fontSize: "0.78rem" }}>
             Use letters, numbers and symbols (e.g. MyPass@123)
          </small>
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="owner">Owner / Landlord</option>
          </select>
        </div>
        {formData.role === "student" && (
          <div className="form-group">
            <label>University ID</label>
            <input
              type="text"
              name="universityId"
              placeholder="e.g. 2001ICT001"
              value={formData.universityId}
              onChange={handleChange}
              required
            />
            <small style={{ color: "#f7ad77", fontSize: "0.78rem" }}>
                  Do not use / . - or spaces in your University ID
            </small>

          </div>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "12px" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


