const catchAsyncErrors = require("../utils/catchAsyncErrors");
const { Page } = require("../models/Pages");
const fs = require('fs');
const path = require('path');

/**-------------------------------------
 * @desc   Add or update a page section with images and descriptions
 * @router /api/v1/pages/:pageName/sections
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
 module.exports.addOrUpdateSection = catchAsyncErrors(async (req, res, next) => {
  const { pageName } = req.params;
  const { title, content, order, keywords } = req.body; // تأكد من أن keywords موجود
  const images = req.body.images || [];
  const links = req.body.links || [];

  // العثور على الصفحة أو إنشائها إذا لم تكن موجودة
  let page = await Page.findOne({ name: pageName });
  if (!page) {
    page = new Page({ name: pageName });
  }

  // إنشاء روابط الصور
  const imagesLinks = req.files.map((file, index) => ({
    url: `/images/${file.filename}`,
    description: images[index] ? images[index].description || "" : "",
    title: images[index] ? images[index].title || "" : "",
    content: images[index] ? images[index].content || "" : "",
  }));

  // إنشاء السكشن
  const section = {
    title,
    content,
    keywords, // إضافة الكلمات المفتاحية
    images: imagesLinks,
    links: links.map((link) => ({
      label: link.label,
      url: link.url,
    })),
    order,
  };

  // البحث عن السكشن باستخدام keywords
  const existingSectionIndex = page.sections.findIndex((sec) => sec.keywords === keywords);

  if (existingSectionIndex > -1) {
    // إذا كان السكشن موجودًا، تحديثه
    page.sections[existingSectionIndex] = { ...page.sections[existingSectionIndex], ...section };
  } else {
    // إذا لم يكن موجودًا، إضافته
    page.sections.push(section);
  }

  // حفظ الصفحة
  await page.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "Section added or updated successfully",
    data: { page },
  });
});




/**-------------------------------------
 * @desc   Get all sections of a page
 * @router /api/v1/pages/:pageName/sections
 * @method GET
 * @access private (admin only)
 -------------------------------------*/
 module.exports.getAllSections = catchAsyncErrors(async (req, res, next) => {
  const { pageName } = req.params;

  // العثور على الصفحة باستخدام اسم الصفحة
  const page = await Page.findOne({ name: pageName });

  if (!page) {
    return res.status(404).json({
      status: "FAIL",
      message: "Page not found",
    });
  }

  res.status(200).json({
    status: "SUCCESS",
    data: { sections: page.sections },
  });
});


/**-------------------------------------
 * @desc   Get a single section by ID
 * @router /api/v1/pages/:pageName/sections/:sectionId
 * @method GET
 * @access private (admin only)
 -------------------------------------*/
 module.exports.getSingleSection = catchAsyncErrors(async (req, res, next) => {
  const { pageName, sectionId } = req.params;

  // العثور على الصفحة باستخدام اسم الصفحة
  const page = await Page.findOne({ name: pageName });

  if (!page) {
    return res.status(404).json({
      status: "FAIL",
      message: "Page not found",
    });
  }

  // العثور على القسم باستخدام ID القسم
  const section = page.sections.id(sectionId);

  if (!section) {
    return res.status(404).json({
      status: "FAIL",
      message: "Section not found",
    });
  }

  res.status(200).json({
    status: "SUCCESS",
    data: { section },
  });
});


/**-------------------------------------
 * @desc   Delete a section by ID
 * @router /api/v1/pages/:pageName/sections/:sectionId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
 
/**-------------------------------------
 * @desc   Delete a section from a page and remove its images
 * @router /api/v1/pages/:pageName/sections/:sectionId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
module.exports.deleteSection = catchAsyncErrors(async (req, res, next) => {
  const { pageName, sectionId } = req.params;

  const page = await Page.findOne({ name: pageName });

  if (!page) {
    return res.status(404).json({
      status: "ERROR",
      message: "Page not found",
    });
  }

  const sectionIndex = page.sections.findIndex(section => section._id.toString() === sectionId);

  if (sectionIndex === -1) {
    return res.status(404).json({
      status: "ERROR",
      message: "Section not found",
    });
  }

  // حذف الصور من السيرفر
  const sectionToDelete = page.sections[sectionIndex];
  sectionToDelete.images.forEach(image => {
    const imagePath = path.join(__dirname, '..', image.url); // تعديل المسار حسب موقع الصور في المشروع
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${imagePath}`, err);
      } else {
        console.log(`Successfully deleted image: ${imagePath}`);
      }
    });
  });

  // حذف القسم من مصفوفة الأقسام
  page.sections.splice(sectionIndex, 1);

  await page.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "Section deleted successfully",
    data: { page },
  });
});
