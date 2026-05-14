const express = require("express");
const router = express.Router();
const {
  createReport,
  getReportsByListing,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/", getAllReports);

router.post("/:listingId", protect, authorize("student"), createReport);


router.get("/listing/:listingId", protect, authorize("owner"), getReportsByListing);
router.put("/:id", protect, authorize("owner"), updateReport);


router.get("/:id", protect, authorize("student", "owner"), getReportById);
router.delete("/:id", protect, authorize("student", "owner"), deleteReport);

module.exports = router;

