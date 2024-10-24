const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema([
  {
    country: { type: String, required: true, trim: true },
    city: { type: String,  trim: true },
  },
]);

const Location = mongoose.model("Location", locationSchema);
module.exports = {
  Location,
};
