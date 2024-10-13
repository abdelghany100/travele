const express = require("express");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken.js");
const {
  createTypePackageCtrl,
  getAllTypePackagesCtrl,
  getSingleTypePackageCtrl,
  updateTypePackageCtrl,
  deleteTypePackageCtrl,
} = require("../controller/typePackageController.js.js");
const validateObjectid = require("../middlewares/validateObjectid.js");
const router = express.Router();

router
  .route("/")
  .post(verifyTokenAndAdmin, createTypePackageCtrl)
  .get(verifyTokenAndAdmin, getAllTypePackagesCtrl);

router.route("/:id" )
.get(validateObjectid , verifyTokenAndAdmin , getSingleTypePackageCtrl)
.patch(validateObjectid , verifyTokenAndAdmin , updateTypePackageCtrl)
.delete(validateObjectid , verifyTokenAndAdmin , deleteTypePackageCtrl)
module.exports = router;
