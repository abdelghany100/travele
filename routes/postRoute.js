const router = require("express").Router();

const {

  getAllPostCtrl,
  createPostCtrl,
  getSinglePostsCtrl,
  deletePostCtrl,
  updatePostCtr,
  updatePostImageCtr,
} = require("../controller/postController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectid = require("../middlewares/validateObjectid");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// /api/posts
router
  .route("/")
  .post(verifyTokenAndAdmin, photoUpload.single("image"), createPostCtrl)
  .get(verifyToken, getAllPostCtrl)


router
  .route("/:id")
  .get(validateObjectid, verifyToken, getSinglePostsCtrl)
  .delete(validateObjectid, verifyTokenAndAdmin , deletePostCtrl )
  .patch(validateObjectid, verifyTokenAndAdmin , updatePostCtr )

router.route("/update-image/:id")
.patch(verifyTokenAndAdmin, photoUpload.single("image"), updatePostImageCtr)


module.exports = router;
