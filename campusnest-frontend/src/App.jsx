import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import SingleListing from "./pages/SingleListing";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import MyReservations from "./pages/MyReservations";
import MyWishlist from "./pages/MyWishlist";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Admin-only Route
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          !user ? <Login /> : <Navigate to="/listings" />
        } />
        <Route path="/register" element={
          !user ? <Register /> : <Navigate to="/listings" />
        } />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />

        {/* Protected Routes — Student */}
        <Route path="/my-reservations" element={
          <ProtectedRoute><MyReservations /></ProtectedRoute>
        } />
        <Route path="/my-wishlist" element={
          <ProtectedRoute><MyWishlist /></ProtectedRoute>
        } />

        {/* Protected Routes — Owner */}
        <Route path="/add-listing" element={
          <ProtectedRoute><AddListing /></ProtectedRoute>
        } />
        <Route path="/edit-listing/:id" element={
          <ProtectedRoute><EditListing /></ProtectedRoute>
        } />
        <Route path="/owner-dashboard" element={
          <ProtectedRoute><OwnerDashboard /></ProtectedRoute>
        } />

        {/* Protected Routes — Admin */}
        <Route path="/admin-dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

