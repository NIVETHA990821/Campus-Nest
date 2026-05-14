const express = require("express");
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getAvailableListings,
  getListingsByType,
  getListingsByGender,
  getListingsByPrice,
  getListingsByDistance,
  searchListings,
} = require("../controllers/listingController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/", getAllListings);
router.get("/filter/available", getAvailableListings);
router.get("/filter/type/:type", getListingsByType);
router.get("/filter/gender/:gender", getListingsByGender);
router.get("/filter/price/:max", getListingsByPrice);
router.get("/filter/distance/:km", getListingsByDistance);
router.get("/search/:name", searchListings); 
router.get("/:id", getListingById);          



router.post("/", protect, authorize("owner"), createListing);
router.put("/:id", protect, authorize("owner"), updateListing);
router.delete("/:id", protect, authorize("owner"), deleteListing);

module.exports = router;


