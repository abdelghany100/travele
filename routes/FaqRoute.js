const express = require("express");
const { createFaqCtr, getAllFaqsCtr, getSingleFaqCtr, updateFaqCtr, deleteFaqCtr } = require("../controller/faqController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/").post(verifyTokenAndAdmin, createFaqCtr).get(getAllFaqsCtr);
router.route("/:id")
.get(getSingleFaqCtr)
.patch(verifyTokenAndAdmin , updateFaqCtr)
.delete(verifyTokenAndAdmin , deleteFaqCtr)
module.exports = router;
