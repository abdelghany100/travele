const { boolean, required } = require("joi");
const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      day: {
        type: Number,
        required: true,
      },
      nights: {
        type: Number,
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    keyword: {
      type: String,
    },
    image: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
    },
    program: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      programItem: [
        {
          day: {
            type: Number,
            required: true, // التأكد من أن اليوم مطلوب
          },
          description: {
            type: String,
            required: true, // التأكد من أن الوصف مطلوب
          },
        },
      ],
    },
    mapImages: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
    },
    isPin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
PackageSchema.virtual("typePackages", {
  ref: "TypePackage",
  localField: "_id",
  foreignField: "packageName",
  justOne: false, // false because we expect multiple TypePackages for one Package
});

const Package = mongoose.model("Package", PackageSchema);

const TypePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pricing: [
    {
      numUser: {
        type: String,
        required: true,
      },
      pricePerUser: {
        type: Number,
        required: true,
      },
    },
  ],
  packageName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
});

const TypePackage = mongoose.model("TypePackage", TypePackageSchema);

module.exports = {
  Package,
  TypePackage,
};
