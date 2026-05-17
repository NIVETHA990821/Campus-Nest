const Listing = require("../models/Listing");

const createListing = async (req, res) => {
  const listing = await Listing.create({
    ...req.body,
    owner: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
};

const getAllListings = async (req, res) => {
  const listings = await Listing.find();
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getMyListings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort({
    updatedAt: -1,
  });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }
  res.status(200).json({
    success: true,
    data: listing,
  });
};

const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  if (!listing.owner || listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only update your own listings",
    });
  }

  const { owner, ...updateData } = req.body;

  const updated = await Listing.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: updated,
  });
};

const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  if (!listing.owner || listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own listings",
    });
  }

  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
};

const getAvailableListings = async (req, res) => {
  const listings = await Listing.find({ isAvailable: true });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getListingsByType = async (req, res) => {
  const listings = await Listing.find({ type: req.params.type });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getListingsByGender = async (req, res) => {
  const listings = await Listing.find({
    "rules.genderAllowed": req.params.gender,
  });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getListingsByPrice = async (req, res) => {
  const listings = await Listing.find({
    "payment.monthlyRent": { $lte: req.params.max },
  });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const getListingsByDistance = async (req, res) => {
  const listings = await Listing.find({
    distanceFromUniversityKm: { $lte: req.params.km },
  });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

const searchListings = async (req, res) => {
  const listings = await Listing.find({
    name: { $regex: req.params.name, $options: "i" },
  });
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
};

module.exports = {
  createListing,
  getAllListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
  getAvailableListings,
  getListingsByType,
  getListingsByGender,
  getListingsByPrice,
  getListingsByDistance,
  searchListings,
};


