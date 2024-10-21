const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: { 
    type: String, 
  },
  content: { 
    type: String 
  },
  images: [
    {
      url: {
        type: String,
        trim: true
      },
      description: {
        type: String
      }
    }
  ],
  links: [
    {
      label: { 
        type: String 
      },
      url: { 
        type: String 
      }
    }
  ],
  order: { 
    type: Number, // لترتيب الأقسام على الصفحة
    default: 0
  }
});

const PageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, // اسم الصفحة (مثلاً: 'home', 'about')
    unique: true
  },
  sections: [SectionSchema], // كل صفحة تحتوي على عدة أقسام
}, { timestamps: true });

const Page = mongoose.model('Page', PageSchema);

module.exports = {Page};
