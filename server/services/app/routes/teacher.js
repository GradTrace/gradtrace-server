const router = require("express").Router();
const TeacherController = require("../controllers/teacher");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);

module.exports = router;
