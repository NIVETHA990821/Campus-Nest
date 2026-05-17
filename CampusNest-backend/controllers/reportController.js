const Report = require("../models/Report");
const Listing = require("../models/Listing");

const createReport = async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const report = await Report.create({
    ...req.body,
    listing: req.params.listingId,
  });

  res.status(201).json({
    success: true,
    message: "Report submitted successfully",
    data: report,
  });
};

const getReportsByListing = async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const reports = await Report.find({
    listing: req.params.listingId,
  })
    .select("-contactNumber -universityId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
};

module.exports = {
  createReport,
  getReportsByListing,
};


