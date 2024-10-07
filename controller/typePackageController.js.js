const { TypePackage } = require("../models/Package");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

/**-------------------------------------
 * @desc   Create a new TypePackage
 * @router /api/v1/type-packages
 * @method POST
 * @access private (only admin)
 -------------------------------------*/
module.exports.createTypePackageCtrl = catchAsyncErrors(
  async (req, res, next) => {
    const { name, pricing, packageName } = req.body;

    const newTypePackage = await TypePackage.create({
      name,
      pricing,
      packageName,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "TypePackage created successfully",
      data: newTypePackage,
    });
  }
);
/**-------------------------------------
 * @desc   Get all TypePackages
 * @router /api/v1/type-packages
 * @method GET
 * @access public
 -------------------------------------*/
 module.exports.getAllTypePackagesCtrl = catchAsyncErrors(async (req, res, next) => {
    const typePackages = await TypePackage.find().populate('packageName');
  
    res.status(200).json({
      status: "SUCCESS",
      results: typePackages.length,
      data: typePackages,
    });
  });

/**-------------------------------------
 * @desc   Get a single TypePackage by ID
 * @router /api/v1/type-packages/:id
 * @method GET
 * @access public
 -------------------------------------*/
 module.exports.getSingleTypePackageCtrl = catchAsyncErrors(async (req, res, next) => {
    const typePackage = await TypePackage.findById(req.params.id).populate('packageName');
  
    if (!typePackage) {
      return next(new AppError("TypePackage not found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      data: typePackage,
    });
  });
/**-------------------------------------
 * @desc   Update a TypePackage
 * @router /api/v1/type-packages/:id
 * @method PUT
 * @access private (only admin)
 -------------------------------------*/
 module.exports.updateTypePackageCtrl = catchAsyncErrors(async (req, res, next) => {
    const updatedTypePackage = await TypePackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('packageName');
  
    if (!updatedTypePackage) {
      return next(new AppError("TypePackage not found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      message: "TypePackage updated successfully",
      data: updatedTypePackage,
    });
  });

  /**-------------------------------------
 * @desc   Delete a TypePackage
 * @router /api/v1/type-packages/:id
 * @method DELETE
 * @access private (only admin)
 -------------------------------------*/
module.exports.deleteTypePackageCtrl = catchAsyncErrors(async (req, res, next) => {
    const typePackage = await TypePackage.findByIdAndDelete(req.params.id);
  
    if (!typePackage) {
      return next(new AppError("TypePackage not found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      message: "TypePackage deleted successfully",
    });
  });
  
    