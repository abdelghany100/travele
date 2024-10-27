const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, trim: true, lowercase: true },
  },
 
);
locationSchema.index({ country: 1, city: 1 }, { unique: true })

const Location = mongoose.model("Location", locationSchema);
module.exports = {
  Location,
};
