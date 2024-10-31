const catchAsyncErrors = require("../utils/catchAsyncErrors");

const path = require("path");
const fs = require("fs");
const ConvertImage = require("../utils/ConvertImage");

module.exports.insertImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded",
    });
  }

  const imageUrl = `/imagesBlogs/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    imageUrl: imageUrl,
  });
});

module.exports.getAllImagesBlogs = catchAsyncErrors(async (req, res, next) => {
  const imagesDir = path.join(__dirname, "../imagesBlogs");

  // قراءة الملفات من المجلد
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error reading images directory",
      });
    }

    // التأكد من وجود ملفات في المجلد
    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found in the directory",
      });
    }

    // إنشاء URLات لكل صورة
    const imagesUrls = files.map((file) => `/imagesBlogs/${file}`);

    res.status(200).json({
      success: true,
      images: imagesUrls,
    });
  });
});

module.exports.deleteImage = catchAsyncErrors(async (req, res, next) => {
  const imageName = req.body.imageName;

  if (!imageName) {
    return res.status(400).json({
      success: false,
      message: "Image name is required",
    });
  }
  console.log(imageName);

  // التأكد من أن المسار يبدأ بـ "/imagesBlogs"
  if (!imageName.startsWith("/imagesBlogs")) {
    return res.status(400).json({
      success: false,
      message: "Image name must start with '/imagesBlogs'",
    });
  }

  // بناء المسار الصحيح بدون تكرار مجلد imagesBlogs
  const imagePath = path.join(__dirname, `..${imageName}`);

  // تحقق مما إذا كانت الصورة موجودة
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err);
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // حذف الصورة
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting image",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    });
  });
});
