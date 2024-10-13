const { getAllUsers, deleteUser } = require("../controller/userController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", verifyTokenAndAdmin , getAllUsers); // Route لجلب جميع المستخدمين مع الباجيناشن
router.delete("/:id", verifyTokenAndAdmin , deleteUser); 
module.exports = router;
