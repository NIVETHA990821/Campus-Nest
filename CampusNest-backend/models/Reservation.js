const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing reference is required"],
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    universityId: {
      type: String,
      required: [true, "University ID is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    moveInDate: {
      type: Date,
      required: [true, "Move in date is required"],
    },
    duration: {
      type: String,
      enum: ["1 month", "3 months", "6 months", "1 year", "2 years", "3 years"],
      required: [true, "Duration is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);


