const Reservation = require("../models/Reservation");
const Listing = require("../models/Listing");


const createReservation = async (req, res) => {
  
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

 
  if (!listing.isAvailable) {
    return res.status(400).json({
      success: false,
      message: "This listing is not available for reservation",
    });
  }

  const reservation = await Reservation.create({
    ...req.body,
    listing: req.params.listingId,
  });

  res.status(201).json({
    success: true,
    message: "Reservation created successfully",
    data: reservation,
  });
};


const getReservationsByListing = async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const reservations = await Reservation.find({
    universityId: req.params.universityId,
  }).populate("listing", "name address payment ownerName ownerContact");

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
};

const getReservationById = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate("listing", "name type address payment");

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Reservation not found",
    });
  }

  res.status(200).json({
    success: true,
    data: reservation,
  });
};

const updateReservation = async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Reservation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Reservation updated successfully",
    data: reservation,
  });
};

const deleteReservation = async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Reservation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Reservation cancelled successfully",
  });
};

const getReservationsByStudent = async (req, res) => {
  const reservations = await Reservation.find({
    universityId: req.params.universityId,
  }).populate("listing", "name type address payment");

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
};

module.exports = {
  createReservation,
  getReservationsByListing,
  getReservationById,
  updateReservation,
  deleteReservation,
  getReservationsByStudent,
};


