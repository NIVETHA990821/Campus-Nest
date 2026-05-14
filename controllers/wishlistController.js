const Wishlist = require("../models/Wishlist");
const Listing = require("../models/Listing");


const addToWishlist = async (req, res) => {
  const { universityId, listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }
t
  let wishlist = await Wishlist.findOne({ universityId });

  if (!wishlist) {
    
    wishlist = await Wishlist.create({
      studentName: req.body.studentName,
      universityId,
      listings: [listingId],
    });

    return res.status(201).json({
      success: true,
      message: "Wishlist created and listing added",
      data: wishlist,
    });
  }

  if (wishlist.listings.includes(listingId)) {
    return res.status(400).json({
      success: false,
      message: "Listing already in wishlist",
    });
  }

  wishlist.listings.push(listingId);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Listing added to wishlist",
    data: wishlist,
  });
};

const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({
    universityId: req.params.universityId,
  }).populate("listings", "name type address payment isAvailable distanceFromUniversityKm");

  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  res.status(200).json({
    success: true,
    count: wishlist.listings.length,
    data: wishlist,
  });
};

const removeFromWishlist = async (req, res) => {
  const { universityId, listingId } = req.params;

  const wishlist = await Wishlist.findOne({ universityId });

  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  if (!wishlist.listings.includes(listingId)) {
    return res.status(404).json({
      success: false,
      message: "Listing not found in wishlist",
    });
  }

  wishlist.listings = wishlist.listings.filter(
    (id) => id.toString() !== listingId
  );
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Listing removed from wishlist",
    data: wishlist,
  });
};

const deleteWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOneAndDelete({
    universityId: req.params.universityId,
  });

  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Wishlist deleted successfully",
  });
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  deleteWishlist,
};

