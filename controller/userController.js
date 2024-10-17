const { User } = require("../models/User");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const fs = require("fs");
const path = require("path");
// Get all users with pagination
module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // تحديد العدد الافتراضي للنتائج في الصفحة
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  // حساب عدد النتائج التي سيتم تجاوزها بناءً على الصفحة المطلوبة
  const skip = (page - 1) * limit;

  // جلب المستخدمين مع الباجيناشن
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select("-password -confirmPassword"); // لا تجلب الحقول الحساسة

  // حساب العدد الكلي للمستخدمين
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: "SUCCESS",
    results: users.length,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    data: users,
  });
});

module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id; // الحصول على معرف المستخدم من الـ params

  // البحث عن المستخدم وحذفه
  const user = await User.findByIdAndDelete(userId);

  // التحقق من وجود المستخدم
  if (!user) {
    return next(new AppError("User not found", 404)); // إذا لم يتم العثور على المستخدم
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "User deleted successfully",
  });
});

module.exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { firstName, lastName } = req.body;

  const updatedData = {};
  if (firstName) updatedData.firstName = firstName;
  if (lastName) updatedData.lastName = lastName;

  const user = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "User updated successfully",
    data: user,
  });
});


module.exports.updateProfileImageCtr = catchAsyncErrors(
  async (req, res, next) => {
   
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const imagePath = `/images/${req.file.filename}`;

   
    const user = await User.findById(req.user.id);

    if (user.profilePhoto) {
      const oldImagePath = path.join(__dirname, `..${user.profilePhoto}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

    }

    user.profilePhoto = imagePath;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Your profile photo uploaded successfully",
      user,
    });
  }
);