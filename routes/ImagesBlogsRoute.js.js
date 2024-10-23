const express = require("express");
const router = express.Router();
const {
  insertImage,
  getAllImagesBlogs,
  deleteImage,
} = require("../controller/imageController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { photoUploadBlog } = require("../middlewares/photoUpload");

// رفع صورة
router.post(
  "/",
  verifyTokenAndAdmin,
  photoUploadBlog.single("image"),
  insertImage
);

router.get("/", verifyTokenAndAdmin, getAllImagesBlogs);
router.delete("/", verifyTokenAndAdmin, deleteImage);

module.exports = router;
