const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
    stayDuration: {
      type: String,
      enum: ["1 month", "3 months", "6 months", "1 year", "2 years", "3 years"],
      required: [true, "Stay duration is required"],
    },
    rating: {
      overall: {
        type: Number,
        min: [1, "Rating minimum is 1"],
        max: [5, "Rating maximum is 5"],
        required: [true, "Overall rating is required"],
      },
      cleanliness: {
        type: Number,
        min: [1, "Rating minimum is 1"],
        max: [5, "Rating maximum is 5"],
        required: [true, "Cleanliness rating is required"],
      },
      safety: {
        type: Number,
        min: [1, "Rating minimum is 1"],
        max: [5, "Rating maximum is 5"],
        required: [true, "Safety rating is required"],
      },
      value: {
        type: Number,
        min: [1, "Rating minimum is 1"],
        max: [5, "Rating maximum is 5"],
        required: [true, "Value rating is required"],
      },
      landlord: {
        type: Number,
        min: [1, "Rating minimum is 1"],
        max: [5, "Rating maximum is 5"],
        required: [true, "Landlord rating is required"],
      },
    },
    wouldRecommend: {
      type: Boolean,
      required: [true, "Recommendation is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

module.exports = mongoose.model("Review", reviewSchema);


