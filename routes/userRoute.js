const { getAllUsers } = require("../controller/userController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", verifyTokenAndAdmin , getAllUsers); // Route لجلب جميع المستخدمين مع الباجيناشن

module.exports = router;
