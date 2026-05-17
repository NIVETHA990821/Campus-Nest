const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing reference is required"],
    },
    reportedBy: {
      type: String,
      required: [true, "Reporter name is required"],
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
    reason: {
      type: String,
      enum: [
        "Fake listing",
        "Wrong price information",
        "Unsafe area",
        "Bars or clubs nearby",
        "Landlord is rude or threatening",
        "Place does not exist",
        "Other",
      ],
      required: [true, "Reason is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Report", reportSchema);

