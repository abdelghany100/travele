const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { Booking, validateBooking } = require("../models/Booking");
const { Package } = require("../models/Package");

module.exports.createBooking = catchAsyncErrors(async (req, res, next) => {
    const { error } = validateBooking(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
  
    const packageExists = await Package.findById(req.body.packageId);
    if (!packageExists) {
      return next(new AppError("Package Not Found", 404));
    }
  
    const booking = await Booking.create(req.body)
  
    res.status(201).json({
      status: "SUCCESS",
      message: "Booking created successfully",
      data: { booking },
    });
  });




  module.exports.updateBooking = catchAsyncErrors(async (req, res, next) => {

  
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!booking) {
      return next(new AppError("Booking Not Found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      message: "Booking updated successfully",
      data: { booking },
    });
  });
  


  module.exports.deleteBooking = catchAsyncErrors(async (req, res, next) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);
  
    if (!booking) {
      return next(new AppError("Booking Not Found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      message: "Booking deleted successfully",
    });
  });


  module.exports.getAllBookings = catchAsyncErrors(async (req, res, next) => {
    const { pageNumber = 1, BOOKING_PER_PAGE = 10, options } = req.query; // Default values
  
    let bookings;
    const totalBookingsCount = await Booking.countDocuments();
  
    // Base query
    const query = {};
    
    // If options are provided, filter by options
    if (options) {
      query.options = options; // Match the options directly
    }
  
    // Pagination and sorting
    bookings = await Booking.find(query)
      .populate('packageId') // Populate packageId
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * BOOKING_PER_PAGE)
      .limit(BOOKING_PER_PAGE);
  
    const totalPages = Math.ceil(totalBookingsCount / BOOKING_PER_PAGE);
  
    res.status(200).json({
      status: "SUCCESS",
      message: "Bookings retrieved successfully",
      length: bookings.length,
      totalBookingsCount,
      totalPages,
      data: { bookings },
    });
  });
  

  module.exports.getSingleBooking = catchAsyncErrors(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).populate("packageId");
  
    if (!booking) {
      return next(new AppError("Booking Not Found", 404));
    }
  
    res.status(200).json({
      status: "SUCCESS",
      message: "Booking retrieved successfully",
      data: { booking },
    });
  });
  