const mongoose = require("mongoose");

// إنشاء Schema لكائن يحتوي على حقلين
const FQASchema = new mongoose.Schema({
    question: {
    type: String,
    required: [true, "question is required"],
    trim: true,
  },
  answer: { 
    type: String,
    required: [true, "answer is required"],
    trim: true,
  },
});

const FAQ = mongoose.model("Fqa", FQASchema );
module.exports ={
    
    FAQ
}