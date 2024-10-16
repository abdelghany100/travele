const express = require("express");
const { createFaqCtr, getAllFaqsCtr, getSingleFaqCtr, updateFaqCtr, deleteFaqCtr, getFaqsWithAnswersCtr, getFaqsWithoutAnswersCtr } = require("../controller/faqController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/").post( createFaqCtr)
router.get("/answer" , getFaqsWithAnswersCtr);
router.get("/not-answer" , verifyTokenAndAdmin , getFaqsWithoutAnswersCtr);
router.route("/:id")
.get(getSingleFaqCtr)
.patch(verifyTokenAndAdmin , updateFaqCtr)
.delete(verifyTokenAndAdmin , deleteFaqCtr)
module.exports = router;
