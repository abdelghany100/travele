const { getAllUsers, deleteUser, updateUser, updateProfileImageCtr } = require("../controller/userController");
const { photoUpload } = require("../middlewares/photoUpload");
const { verifyTokenAndAdmin, verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", verifyTokenAndAdmin , getAllUsers); // Route لجلب جميع المستخدمين مع الباجيناشن
router.delete("/:id", verifyTokenAndAdmin , deleteUser); 
router.patch("/", verifyToken , updateUser); 
router
  .route("/profile-photo")
  .post(verifyToken, photoUpload.single("image"), updateProfileImageCtr);

module.exports = router;
