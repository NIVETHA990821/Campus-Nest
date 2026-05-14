const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByListing,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/:listingId", getReviewsByListing);

router.post("/:listingId", protect, authorize("student"), createReview);
router.put("/:id", protect, authorize("student"), updateReview);
router.delete("/:id", protect, authorize("student"), deleteReview);

module.exports = router;

