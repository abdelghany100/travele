const express = require("express");
const {
  //   getAllPages,
  //   createPage,
  //   getPageByName,
  //   updateSection,
  //   deleteSection,
  //   getSingleSection,
  addOrUpdateSection,
  getAllSections,
  getSingleSection,
  deleteSection,
  updateSection,
} = require("../controller/pagesController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { photoUpload } = require("../middlewares/photoUpload");

const router = express.Router();

router.get("/:pageName/sections", getAllSections);

router.post(
  "/:pageName/sections",
  verifyTokenAndAdmin,
  photoUpload.array("images"),
  addOrUpdateSection
);

router.get("/:pageName/sections/:sectionId", getSingleSection);
router.delete("/:pageName/sections/:sectionId", deleteSection);


module.exports = router;
