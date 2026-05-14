const Review = require("../models/Review");
const Listing = require("../models/Listing");


const createReview = async (req, res) => {
 
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

 
  const review = await Review.create({
    ...req.body,
    listing: req.params.listingId,
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
};

const getReviewsByListing = async (req, res) => {
 
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const reviews = await Review.find({ listing: req.params.listingId });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
};


const updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
};


const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};

module.exports = {
  createReview,
  getReviewsByListing,
  updateReview,
  deleteReview,
};

