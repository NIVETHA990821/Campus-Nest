const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/:listingId", protect, authorize("student"), createReport);
router.get("/", protect, authorize("admin"), getAllReports);
router.get("/:id", protect, authorize("admin"), getReportById);
router.put("/:id", protect, authorize("admin"), updateReport);
router.delete("/:id", protect, authorize("admin"), deleteReport);

module.exports = router;


