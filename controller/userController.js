const { User } = require("../models/User");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

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
