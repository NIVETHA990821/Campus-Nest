const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservationsByListing,
  getReservationById,
  updateReservation,
  deleteReservation,
  getReservationsByStudent,
} = require("../controllers/reservationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/:listingId", protect, authorize("student"), createReservation);
router.get("/student/:universityId", protect, authorize("student"), getReservationsByStudent);


router.get("/listing/:listingId", protect, authorize("owner"), getReservationsByListing);
router.put("/:id", protect, authorize("owner"), updateReservation);


router.get("/:id", protect, authorize("student", "owner"), getReservationById);
router.delete("/:id", protect, authorize("student", "owner"), deleteReservation);

module.exports = router;



