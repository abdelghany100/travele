const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const compression = require("compression");
const { errorHandler, notFound } = require("./middlewares/error");
const path = require("path");

const app = express();

const DB = process.env.DATABASE_URI.replace("<USER>", process.env.DATABASE_USER)
  .replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  .replace("<DATABASENAME>", process.env.DATABASE_NAME);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

// Add compression middleware
app.use(compression());

app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/posts", require("./routes/postRoute"));
app.use("/api/v1/package", require("./routes/packageRoute"));
app.use("/api/v1/type-package", require("./routes/typePackageRoute"));
app.use("/api/v1/comments", require("./routes/commentRoute"));
app.use("/api/v1/faq", require("./routes/FaqRoute"));
app.use("/api/v1/bookings", require("./routes/BookingRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/pages", require("./routes/pagesRoute"));

app.use(notFound);

app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server has started on port 8000");
});
