const fs = require("fs");
const path = require("path");
const { FAQ } = require("../models/FAQ");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");

/**-------------------------------------
 * @desc   Create new Faq
 * @router /api/v1/faq
 * @method POST
 * @access private(only admin)
 -------------------------------------*/
module.exports.createFaqCtr = catchAsyncErrors(async (req, res, next) => {

    const {question , answer} = req.body;

    const NewFaq = new FAQ({
        question,
        answer
    })

    await NewFaq.save();

    res.status(201).json({
        status: "SUCCESS",
        message: "faq created  successfully",
        length: NewFaq.length,
        data: { NewFaq },
      });
});

/**-------------------------------------
 * @desc   get all faq
 * @router /api/v1/faq
 * @method GET
 * @access public
 -------------------------------------*/
module.exports.getAllFaqsCtr = catchAsyncErrors(async (req, res, next) => {
    const faqs = await FAQ.find(); // الحصول على جميع الـ FAQs

    if (!faqs || faqs.length === 0) {
        return next(new AppError("No FAQs found", 404));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "FAQs retrieved successfully",
        length: faqs.length,
        data: { faqs },
    });
});

/**-------------------------------------
 * @desc   get single faq
 * @router /api/v1/faq/:id
 * @method GET
 * @access public
 -------------------------------------*/
 module.exports.getSingleFaqCtr = catchAsyncErrors(async (req, res, next) => {
    const faq = await FAQ.findById(req.params.id); 

    if (!faq) {
        return next(new AppError("FAQ Not Found", 404));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "FAQ retrieved successfully",
        data: { faq },
    });
});
/**-------------------------------------
 * @desc   update  faq
 * @router /api/v1/faq/:id
 * @method PATCH
 * @access private (only admin)
 -------------------------------------*/
module.exports.updateFaqCtr = catchAsyncErrors(async (req, res, next) => {
    const { question, answer } = req.body; // استخراج القيم من body

    const faq = await FAQ.findByIdAndUpdate(
        req.params.id,
        { question, answer }, // القيم المحدثة
        { new: true, runValidators: true } // إرجاع الوثيقة المحدثة والتحقق من القيم
    );

    if (!faq) {
        return next(new AppError("FAQ Not Found", 404));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "FAQ updated successfully",
        data: { faq },
    });
});

/**-------------------------------------
 * @desc   delete  faq
 * @router /api/v1/faq/:id
 * @method DELETE
 * @access private (only admin)
 -------------------------------------*/
 module.exports.deleteFaqCtr = catchAsyncErrors(async (req, res, next) => {
    const faq = await FAQ.findByIdAndDelete(req.params.id); // حذف FAQ باستخدام المعرف
    if (!faq) {
        return next(new AppError("FAQ Not Found", 404));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "FAQ deleted successfully",
    });
});
