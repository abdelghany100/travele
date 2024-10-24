const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { Package, TypePackage } = require("../models/Package");
const fs = require("fs");
const path = require("path");
/**-------------------------------------
 * @desc   Create new package
 * @router /api/v1/package
 * @method POST
 * @access private(only admin)
 -------------------------------------*/

module.exports.createPackageCtrl = catchAsyncErrors(async (req, res, next) => {
  // 1. validation for image

  const {
    title,
    titleOutSide,
    description,
    descriptionOutSide,
    duration,
    location,
    category,
    image,
    program,
    mapImages,
    keyword
  } = req.body;

  const newPackage = new Package({
    title,
    titleOutSide,
    description,
    descriptionOutSide,
    duration: {
      day: duration.day,
      nights: duration.nights,
    },
    keyword,
    location,
    category,
    program: {
      title: program.title,
      description: program.description,
      programItem: program.programItem || [],
    },
  });

  const savedPackage = await newPackage.save();

  res.status(201).json({
    status: "SUCCESS",
    message: "package created  successfully",
    length: newPackage.length,
    data: { newPackage },
  });
});
/**-------------------------------------
 * @desc   insert image Package
 * @router /api/v1/image-package:id
 * @method POST
 * @access private(only admin)
 -------------------------------------*/

module.exports.createImagePackageCtrl = catchAsyncErrors(
  async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new AppError("No images provided", 400));
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return next(new AppError("Package Not Found", 404));
    }
    const images = req.files.map((file) => ({
      url: `/images/${file.filename}`,
    }));
    const updatedImage = await Package.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: images,
        },
      },
      { new: true }
    );

    if (package.image && package.image.length > 0) {
      package.image.forEach((image) => {
        console.log(image);
        const imagePath = path.join(__dirname, "..", image.url);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", image.url, err);
          }
        });
      });
    }

    res.status(201).json({
      status: "SUCCESS",
      message: "package added image  successfully",
      length: updatedImage.length,
      data: { updatedImage },
    });
  }
);
/**-------------------------------------
 * @desc   insert image map
 * @router /api/v1/image-map:id
 * @method POST
 * @access private(only admin)
 -------------------------------------*/

module.exports.createImageMapCtrl = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("No images provided", 400));
  }

  const package = await Package.findById(req.params.id);
  if (!package) {
    return next(new AppError("Package Not Found", 404));
  }

  // إضافة الصور الجديدة
  const images = req.files.map((file) => ({
    url: `/images/${file.filename}`,
  }));

  const updatedImage = await Package.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        mapImages: images,
      },
    },
    { new: true }
  );

  // حذف الصور القديمة
  if (package.mapImages && package.mapImages.length > 0) {
    package.mapImages.forEach((image) => {
      const imagePath = path.join(__dirname, "..", image.url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", image.url, err);
        }
      });
    });
  }

  res.status(201).json({
    status: "SUCCESS",
    message: "Package images updated successfully",
    length: updatedImage.length,
    data: { updatedImage },
  });
});

/**-------------------------------------
 * @desc   get  all packages
 * @router /api/v1/package
 * @method GET
 * @access public 
 -------------------------------------*/
module.exports.getAllPackages = catchAsyncErrors(async (req, res, next) => {
  const { pageNumber = 1, PACKAGE_PER_PAGE = 4, category, location } = req.query;

  let filter = {}; // كائن الفلاتر

  // إضافة الفلاتر بناءً على المدخلات
  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = location;
  }

  // احسب العدد الإجمالي للبيانات بعد التصفية
  const totalPackagesCount = await Package.countDocuments(filter);

  // ابحث عن البيانات المصفاة وطبق pagination
  const packages = await Package.find(filter)
    .populate("typePackages")
    .sort({ isPin: -1, createdAt: -1 })
    .skip((pageNumber - 1) * PACKAGE_PER_PAGE)
    .limit(PACKAGE_PER_PAGE);

  // احسب العدد الإجمالي للصفحات بناءً على البيانات المصفاة
  const totalPages = Math.ceil(totalPackagesCount / PACKAGE_PER_PAGE);

  res.status(200).json({
    status: "SUCCESS",
    message: "Packages retrieved successfully",
    length: packages.length,
    totalPackagesCount,
    totalPages,
    data: { packages },
  });
});

/**-------------------------------------
 * @desc   Get single package by ID
 * @router /api/v1/package/:id
 * @method GET
 * @access public
 -------------------------------------*/
module.exports.getSinglePackage = catchAsyncErrors(async (req, res, next) => {
  const package = await Package.findById(req.params.id).populate(
    "typePackages"
  );

  if (!package) {
    return next(new AppError("Package Not Found", 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "Package retrieved successfully",
    data: { package },
  });
});

/**-------------------------------------
 * @desc   Delete package by ID and remove images
 * @router /api/v1/package/:id
 * @method DELETE
 * @access private (only admin)
 -------------------------------------*/
module.exports.deletePackage = catchAsyncErrors(async (req, res, next) => {
  const package = await Package.findById(req.params.id);

  if (!package) {
    return next(new AppError("Package Not Found", 404));
  }

  // حذف الصور المرتبطة بالحزمة
  if (
    (package.mapImages && package.mapImages.length > 0) ||
    (package.image && package.image.length > 0)
  ) {
    package.mapImages.forEach((image) => {
      const imagePath = path.join(__dirname, "..", image.url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", image.url, err);
        }
      });
    });

    package.image.forEach((image) => {
      console.log(image);
      const imagePath = path.join(__dirname, "..", image.url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", image.url, err);
        }
      });
    });
  }

  await TypePackage.deleteMany({ packageName: req.params.id });

  // حذف الحزمة من قاعدة البيانات
  await Package.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "SUCCESS",
    message: "Package and associated images deleted successfully..",
  });
});

/**-------------------------------------
 * @desc   update by ID
 * @router /api/v1/package/:id
 * @method PATCH
 * @access private (only admin)
 -------------------------------------*/
module.exports.updatePackage = catchAsyncErrors(async (req, res, next) => {
  const updatedPackage = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPackage) {
    return next(new AppError("Package Not Found", 404));
  }

  // إعادة الاستجابة
  res.status(200).json({
    status: "SUCCESS",
    message: "Package updated successfully",
    data: { updatedPackage },
  });
});

module.exports.togglePinPinCtr = catchAsyncErrors(async (req, res, next) => {
  // جلب الحزمة الحالية
  const currentPackage = await Package.findById(req.params.id);

  if (!currentPackage) {
    return next(new AppError("Package Not Found", 404));
  }

  // عكس قيمة isPin
  const toggledPin = !currentPackage.isPin;

  // تحديث الحزمة بقيمة isPin الجديدة
  const updatedPackage = await Package.findByIdAndUpdate(
    req.params.id,
    {
      isPin: toggledPin,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "SUCCESS",
    message: "Package pin status toggled successfully",
    data: { updatedPackage },
  });
});



/**-------------------------------------
 * @desc   Get all unique categories
 * @router /api/v1/package/categories
 * @method GET
 * @access public 
 -------------------------------------*/
 module.exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Package.distinct("category");

  if (!categories) {
    return res.status(404).json({
      status: "FAIL",
      message: "No categories found",
    });
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "Categories retrieved successfully",
    length: categories.length,
    data: { categories },
  });
});
