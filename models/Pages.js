const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  images: [
    {
      url: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
      },
      title: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],

links: [
    {
      label: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  order: {
    type: Number,
    default: 0,
  },
});

const PageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    sections: [SectionSchema],
  },
  { timestamps: true }
);

// Custom pre-save validation to check for unique keywords in sections
PageSchema.pre("save", function (next) {
  const keywordsSet = new Set();
  for (const section of this.sections) {
    if (keywordsSet.has(section.keywords)) {
      const error = new Error(`Duplicate keyword found: ${section.keywords}`);
      return next(error);
    }
    keywordsSet.add(section.keywords);
  }
  next();
});

const Page = mongoose.model("Page", PageSchema);

module.exports = { Page };
