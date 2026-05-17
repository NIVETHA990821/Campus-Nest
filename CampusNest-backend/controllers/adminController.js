const User = require("../models/User");
const Listing = require("../models/Listing");
const Report = require("../models/Report");
const Reservation = require("../models/Reservation");
const Review = require("../models/Review");

const getStats = async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalOwners,
    totalListings,
    availableListings,
    totalReservations,
    pendingReservations,
    totalReviews,
    totalReports,
    pendingReports,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "owner" }),
    Listing.countDocuments({}),
    Listing.countDocuments({ isAvailable: true }),
    Reservation.countDocuments({}),
    Reservation.countDocuments({ status: "pending" }),
    Review.countDocuments({}),
    Report.countDocuments({}),
    Report.countDocuments({ status: "pending" }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        students: totalStudents,
        owners: totalOwners,
      },
      listings: {
        total: totalListings,
        available: availableListings,
        occupied: totalListings - availableListings,
      },
      reservations: {
        total: totalReservations,
        pending: pendingReservations,
      },
      reviews: {
        total: totalReviews,
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
      },
    },
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};


const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin accounts cannot be deleted via this route",
    });
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};


const getAllReportsAdmin = async (req, res) => {
  const reports = await Report.find({})
    .populate("listing", "name type address owner")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
};


const resolveReport = async (req, res) => {
  const { status } = req.body;
  if (!["reviewed", "dismissed", "pending"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }
  res.status(200).json({
    success: true,
    message: `Report status updated to ${status}`,
    data: report,
  });
};

const deleteListingAsAdmin = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const reportUpdate = await Report.updateMany(
    { listing: req.params.id, status: "pending" },
    { status: "dismissed" }
  );

  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: `Listing deleted by admin. ${reportUpdate.modifiedCount} related report(s) closed.`,
  });
};

module.exports = {
  getStats,
  getAllUsers,
  deleteUser,
  getAllReportsAdmin,
  resolveReport,
  deleteListingAsAdmin,
};

