const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CampusNest API 🏠",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      listings: "/api/listings",
      reviews: "/api/reviews",
      reservations: "/api/reservations",
      wishlist: "/api/wishlist",
      reports: "/api/reports",
      admin: "/api/admin",
    },
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ CampusNest Server running on port ${PORT}`);
});


