const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  seedAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/seed-admin", seedAdmin);

router.get("/profile", protect, getProfile);

module.exports = router;

