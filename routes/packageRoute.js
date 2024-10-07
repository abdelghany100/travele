const express = require("express");
const { Package, TypePackage } = require("../models/Package");
const {
  createPackageCtrl,
  createImagePackageCtrl,
  createImageMapCtrl,
  getAllPackages, 
  deletePackage,
  getSinglePackage,
  updatePackage,
  togglePinPinCtr

} = require("../controller/packageController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { photoUpload } = require("../middlewares/photoUpload");

const router = express.Router();
router.route("/toggle-pin/:id").get(verifyTokenAndAdmin , togglePinPinCtr)

router
  .route("/")
  .post(verifyTokenAndAdmin, createPackageCtrl)
  .get(getAllPackages);
router
  .route("/:id")
  .delete(verifyTokenAndAdmin, deletePackage)
  .get(getSinglePackage)
  .patch(verifyTokenAndAdmin , updatePackage);
router.post(
  "/image-package/:id",
  verifyTokenAndAdmin,
  photoUpload.array("images", 10),
  createImagePackageCtrl
);
router.post(
  "/image-map/:id",
  verifyTokenAndAdmin,
  photoUpload.array("images", 10),
  createImageMapCtrl 
); 

module.exports = router;
