const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllReportsAdmin,
  resolveReport,
  deleteListingAsAdmin,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/reports", getAllReportsAdmin);
router.put("/reports/:id", resolveReport);

router.delete("/listings/:id", deleteListingAsAdmin);

module.exports = router;
