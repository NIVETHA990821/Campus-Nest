const express = require("express");
const router = express.Router();
const {
  createReport,
  getReportsByListing,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/listing/:listingId", getReportsByListing);

router.post("/:listingId", protect, authorize("student"), createReport);


module.exports = router;
