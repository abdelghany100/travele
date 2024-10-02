const express = require("express");
const {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/bookingController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

// Routes for Booking
router
  .route("/")
  .post(verifyTokenAndAdmin, createBooking)  
  .get(getAllBookings);                      
router
  .route("/:id")
  .get(verifyTokenAndAdmin ,getSingleBooking)                      
  .patch(verifyTokenAndAdmin, updateBooking)  
  .delete(verifyTokenAndAdmin, deleteBooking);

module.exports = router;
