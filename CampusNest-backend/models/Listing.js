const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
    },
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["single", "shared", "full house", "boarding"],
      required: [true, "Accommodation type is required"],
    },
    rules: {
      genderAllowed: {
        type: String,
        enum: ["male", "female", "any"],
        required: [true, "Gender preference is required"],
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      visitorsAllowed: {
        type: Boolean,
        default: false,
      },
      curfewTime: {
        type: String,
        default: "No Curfew",
      },
    },
    payment: {
      monthlyRent: {
        type: Number,
        required: [true, "Monthly rent is required"],
      },
      advancePayment: {
        type: Number,
        default: 0,
      },
      advanceMonths: {
        type: Number,
        enum: [0, 1, 3, 6],
        default: 0,
      },
      utilitiesIncluded: {
        type: Boolean,
        default: false,
      },
    },
    meals: {
      canCook: {
        type: Boolean,
        default: false,
      },
      orderFoodAvailable: {
        type: Boolean,
        default: false,
      },
      mealsProvided: {
        type: Boolean,
        default: false,
      },
      mealPrice: {
        type: Number,
        default: 0,
      },
    },
    furnishing: {
      isFurnished: {
        type: Boolean,
        default: false,
      },
      items: {
        type: [String],
        default: [],
      },
    },
    hasNearbyFacilities: {
      supermarket: { type: Boolean, default: false },
      pharmacy: { type: Boolean, default: false },
      bookShop: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      transport: {
        busHalt: { type: Boolean, default: false },
        autoStand: { type: Boolean, default: false },
      },
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    distanceFromUniversityKm: {
      type: Number,
      required: [true, "Distance is required"],
      max: [10, "Distance cannot exceed 10km"],
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    ownerContact: {
      type: String,
      required: [true, "Owner contact is required"],
      trim: true,
    },
    isSafe: {
      type: Boolean,
      default: true,
    },
    noBarsOrClubs: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

module.exports = mongoose.model("Listing", listingSchema);


