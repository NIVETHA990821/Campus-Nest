const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    universityId: {
      type: String,
      required: [true, "University ID is required"],
      trim: true,
      unique: true,
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);

