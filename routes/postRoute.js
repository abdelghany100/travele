const router = require("express").Router();

const {

  getAllPostCtrl,
  createPostCtrl,
  getSinglePostsCtrl,
  deletePostCtrl,
  updatePostCtr,
  updatePostImageCtr,
} = require("../controller/postController");
const {photoUpload} = require("../middlewares/photoUpload");
const validateObjectid = require("../middlewares/validateObjectid");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// /api/posts
router
  .route("/")
  .post( verifyTokenAndAdmin, photoUpload.array("images", 10), createPostCtrl)
  .get(getAllPostCtrl)

router
  .route("/:id")
  .get(validateObjectid, getSinglePostsCtrl)
  .delete(validateObjectid ,verifyTokenAndAdmin ,deletePostCtrl )
  .patch(validateObjectid , verifyTokenAndAdmin ,updatePostCtr )

router.route("/update-image/:id")
.patch(verifyTokenAndAdmin, photoUpload.array("images", 10), updatePostImageCtr)


module.exports = router;
