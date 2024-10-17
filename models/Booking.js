const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    
    options: {
        type: [String], // Change to an array of strings
        enum: ["tour guide", "insurance", "dinner", "bike rent"],
        required: true,
      },
    message: {
      type: String,
      trim: true,
      default: "", // Optional message field
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package", // Link to the Package model
      required: true,
    },
  },
  { timestamps: true }
);

const joi = require("joi");

// Joi Validator for Booking
function validateBooking(data) {
  const schema = joi.object({
    name: joi.string().trim().required().messages({
      "string.empty": "Name is required",
    }),
    city:joi.string().trim().required().messages({
      "string.empty": "Name is required",

    }),
    country:joi.string().trim().required().messages({
      "string.empty": "Name is required",

    }),
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    number: joi.string().trim().required().messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must contain only digits",
    }),
    date: joi.date().required().messages({
      "date.base": "Date is required and must be a valid date",
    }),
    options: joi
      .array()
      .items(joi.string().valid("tour guide", "insurance", "dinner", "bike rent")) // Update to array of strings with enum validation
      .min(1) // Require at least one option
      .required()
      .messages({
        "array.min": "At least one option is required",
        "any.only": "Invalid option selected",
      }),
    message: joi.string().trim().optional(),
    packageId: joi.string().required().messages({
        'string.empty': 'Package ID is required',
      }),
  });

  return schema.validate(data);
}

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = { validateBooking, Booking };
