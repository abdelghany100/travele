const mongoose = require("mongoose");
const { trim } = require("validator");
const Joi = require("joi");


// إنشاء Schema لكائن يحتوي على حقلين
const FQASchema = new mongoose.Schema({
    question: {
    type: String,
    required: [true, "question is required"],
    trim: true,
  },
  answer: { 
    type: String,
    // required: [true, "answer is required"],
    trim: true,
  },
  name:{
    type: String,
    trim: true,
  },
  email:{
    type: String,
    trim: true,
  },
  phone:{
    type: String,
    trim: true,
  },
});
function validateFac(obj) {
  const Schema = Joi.object({
  
    email: Joi.string().trim().email(),
    phone: Joi.string().trim(),
    name: Joi.string().trim(),
    answer: Joi.string().trim(),
    question: Joi.string().trim().required(),
  });
  return Schema.validate(obj);
}
const FAQ = mongoose.model("Fqa", FQASchema );
module.exports ={
    validateFac,
    FAQ
}