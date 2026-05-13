const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

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
    },
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CampusNest Server running on port ${PORT}`);
});
