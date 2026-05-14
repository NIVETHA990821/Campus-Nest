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
  });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
};


const getAllReports = async (req, res) => {
  const reports = await Report.find()
    .populate("listing", "name type address");

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
};


const getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("listing", "name type address");

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }

  res.status(200).json({
    success: true,
    data: report,
  });
};


const updateReport = async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Report updated successfully",
    data: report,
  });
};

const deleteReport = async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Report deleted successfully",
  });
};

module.exports = {
  createReport,
  getReportsByListing,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};


