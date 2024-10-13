const fs = require("fs");
const path = require("path");
const { FAQ, validateFac } = require("../models/FAQ");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");

/**-------------------------------------
 * @desc   Create new Faq
 * @router /api/v1/faq
 * @method POST
 * @access private(only admin)
 -------------------------------------*/
module.exports.createFaqCtr = catchAsyncErrors(async (req, res, next) => {
    const { error } = validateFac(req.body);
    if (error) {
      return next(new AppError(`${error.details[0].message}`, 400));
    }
  const { question, answer, name, email, phone } = req.body;

  const NewFaq = new FAQ({
    question,
    answer,
    name,
    email,
    phone,
  });

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
module.exports.getFaqsWithAnswersCtr = catchAsyncErrors(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // البحث عن الأسئلة التي تحتوي على إجابات (answer موجودة)
    const faqs = await FAQ.find({ answer: { $exists: true, $ne: "" } })
      .skip(skip)
      .limit(limit);

    if (!faqs || faqs.length === 0) {
      return next(new AppError("No FAQs with answers found", 404));
    }

    const totalFaqs = await FAQ.countDocuments({
      answer: { $exists: true, $ne: "" },
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "FAQs with answers retrieved successfully",
      length: faqs.length,
      page,
      totalPages: Math.ceil(totalFaqs / limit),
      data: { faqs },
    });
  }
);

module.exports.getFaqsWithoutAnswersCtr = catchAsyncErrors(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // البحث عن الأسئلة التي لا تحتوي على إجابات (answer غير موجودة أو فارغة)
    const faqs = await FAQ.find({ answer: { $exists: false } })
      .skip(skip)
      .limit(limit);

    if (!faqs || faqs.length === 0) {
      return next(new AppError("No FAQs without answers found", 404));
    }

    const totalFaqs = await FAQ.countDocuments({ answer: { $exists: false } });

    res.status(200).json({
      status: "SUCCESS",
      message: "FAQs without answers retrieved successfully",
      length: faqs.length,
      page,
      totalPages: Math.ceil(totalFaqs / limit),
      data: { faqs },
    });
  }
);

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
