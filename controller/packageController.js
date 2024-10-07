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
    description,
    duration,
    location,
    category,
    image,
    program,
    mapImages,
  } = req.body;

  const newPackage = new Package({
    title,
    description,
    duration: {
      day: duration.day,
      nights: duration.nights,
    },
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
  const { pageNumber, PACKAGE_PER_PAGE, category, location } = req.query;

  let packages;

  const totalPackagesCount = await Package.countDocuments();
  if (pageNumber && !category && !location) {
    packages = await Package.find()
      .populate("typePackages")
      .skip((pageNumber - 1) * PACKAGE_PER_PAGE)
      .limit(PACKAGE_PER_PAGE)
      .sort({ isPin: -1, createdAt: -1 });
  } else if (category) {
    packages = await Package.find({ category })
      .sort({ isPin: -1, createdAt: -1 })
      .skip((pageNumber - 1) * PACKAGE_PER_PAGE)
      .limit(PACKAGE_PER_PAGE);
  } else if (location) {
    packages = await Package.find({ location })
      .sort({ isPin: -1, createdAt: -1 })
      .skip((pageNumber - 1) * PACKAGE_PER_PAGE)
      .limit(PACKAGE_PER_PAGE);
  } else {
    packages = await Package.find().sort({ isPin: -1, createdAt: -1 });
  }

  const totalPages = Math.ceil(totalPackagesCount / PACKAGE_PER_PAGE);

  res.status(200).json({
    status: "SUCCESS",
    message: "Products retrieved successfully",
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
