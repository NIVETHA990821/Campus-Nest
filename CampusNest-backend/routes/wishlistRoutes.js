const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/:universityId/:listingId", protect, authorize("student"), addToWishlist);
router.get("/:universityId", protect, authorize("student"), getWishlist);
router.delete("/:universityId/:listingId", protect, authorize("student"), removeFromWishlist);
router.delete("/:universityId", protect, authorize("student"), deleteWishlist);

module.exports = router;

